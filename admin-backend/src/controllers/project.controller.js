import { Project } from "../model/project.model.js"; // adjust path if needed
import { Skill } from "../model/skill.model.js";
import { ApiError } from "../services/ApiError.js";
import { ApiRespose } from "../services/ApiResponse.js";

import { cloudinary } from "../utils/cloudinary.js";

import { promises as fs } from "fs";


/* ─────────────── CREATE ─────────────── */
import { Types } from "mongoose";

// controllers/project.controller.js
export const uploadProjectImage = async (req, res, next) => {
  try {
    if (!req.admin?._id) {
      return res.status(401).json(
        new ApiRespose(401, null, "Unauthorized")
      );
    }

    if (!req.file?.path) {
      throw new ApiError(400, "Image file is required");
    }

    // 👇 Optional: use timestamp-based public_id for uniqueness
    const imagePublicId = `project_${Date.now()}`;

    // ⬆️ Upload to Cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "project_images",
      public_id: imagePublicId,
      overwrite: true,
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    // 🧹 Remove local temp file
    await fs.unlink(req.file.path).catch(() => {});

    // ✅ Return secure URL and public_id
    return res.status(200).json(
      new ApiRespose(200, {
        url: upload.secure_url,
        public_id: upload.public_id,
      }, "Project image uploaded successfully")
    );
  } catch (error) {
    next(new ApiError(500, "Project image upload failed", error));
  }
};
export const createProject = async (req, res) => {
  try {
    /* ───────────── 1. destructure body ───────────── */
    const {
      title,
      description,
      githubLink,
      liveLink,
      category,
      technologies,
      image: imageUrlFromBody,
      isArchived = false,
      isFeatured = false,
    } = req.body;

    /* ───────────── 2. validate required fields ───────────── */
    const requiredFields = ['title', 'description', 'githubLink', 'liveLink', 'category', 'technologies'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json(
        new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`)
      );
    }

    /* ───────────── 3. resolve image if present ───────────── */
    const uploadedImage = req.file?.filename;
    let imageUrl = imageUrlFromBody?.trim();

    if (uploadedImage) {
      // Generate full URL for preview
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${uploadedImage}`;
    }

    /* ───────────── 4. technologies parsing ───────────── */
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies.map(t => t.trim()).filter(Boolean);
    } else if (typeof technologies === "string") {
      try {
        techArray = JSON.parse(technologies);
        if (!Array.isArray(techArray)) throw new Error();
        techArray = techArray.map(t => t.trim()).filter(Boolean);
      } catch {
        techArray = technologies.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    if (techArray.length === 0) {
      return res.status(400).json(
        new ApiError(400, "Technologies must contain at least one valid item")
      );
    }

    /* ───────────── 5. category lookup (ObjectId or name) ───────────── */
    let categoryId;

    if (Types.ObjectId.isValid(category)) {
      categoryId = new Types.ObjectId(category);
      const exists = await Skill.exists({ _id: categoryId });
      if (!exists) return res.status(404).json(
        new ApiError(404, "Skill category not found")
      );
    } else {
      const categoryDoc = await Skill.findOne({
        name: { $regex: `^${category.trim()}$`, $options: "i" },
      });
      
      if (!categoryDoc) return res.status(404).json(
        new ApiError(404, "Skill category not found")
      );
      
      categoryId = categoryDoc._id;
    }

    /* ───────────── 6. create project ───────────── */
    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      githubLink: githubLink.trim(),
      liveLink: liveLink.trim(),
      category: categoryId,
      technologies: techArray,
      isArchived: isArchived === true || isArchived === "true",
      isFeatured: isFeatured === true || isFeatured === "true",
      ...(imageUrl && { image: imageUrl }), // Only add if image exists
    });

    return res.status(201).json(
      new ApiRespose(201, project, "Project created successfully")
    );
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).json(
      new ApiError(500, "Internal Server Error", err.message)
    );
  }
};

/* ─────────────── UPDATE ─────────────── */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate project ID
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new ApiError(400, "Invalid project ID format")
      );
    }

    // 2️⃣ Extract body + file
    const {
      title,
      description,
      githubLink,
      liveLink,
      category,
      technologies,
      isArchived,
      isFeatured,
      image: imageUrlFromBody,
    } = req.body ?? {};
    console.log(req.body)

    const uploadedImage = req.file?.filename;
    console.log(uploadedImage)

    // 3️⃣ Build dynamic update object
    const update = {};

    if (title) update.title = title.trim();
    if (description) update.description = description.trim();
    if (githubLink) update.githubLink = githubLink.trim();
    if (liveLink) update.liveLink = liveLink.trim();

    // Handle image updates
    if (uploadedImage) {
      // Generate full URL for preview
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      update.image = `${baseUrl}/uploads/${uploadedImage}`;
    } else if (imageUrlFromBody) {
      update.image = imageUrlFromBody.trim();
    }

    // Handle booleans
    if (typeof isArchived !== "undefined") {
      update.isArchived = isArchived === true || isArchived === "true";
    }
    if (typeof isFeatured !== "undefined") {
      update.isFeatured = isFeatured === true || isFeatured === "true";
    }

    // 4️⃣ Category handling
    if (category) {
      let categoryId;

      if (Types.ObjectId.isValid(category)) {
        categoryId = new Types.ObjectId(category);
        const exists = await Skill.exists({ _id: categoryId });
        if (!exists) return res.status(404).json(
          new ApiError(404, "Referenced skill category not found")
        );
      } else {
        const categoryDoc = await Skill.findOne({
          name: { $regex: `^${category.trim()}$`, $options: "i" },
        });
        
        if (!categoryDoc) return res.status(404).json(
          new ApiError(404, "Referenced skill category not found")
        );
        
        categoryId = categoryDoc._id;
      }

      update.category = categoryId;
    }

    // 5️⃣ Technologies handling
    if (technologies) {
      let techArr;

      if (Array.isArray(technologies)) {
        techArr = technologies.map(t => t.trim()).filter(Boolean);
      } else if (typeof technologies === "string") {
        try {
          techArr = JSON.parse(technologies);
          if (!Array.isArray(techArr)) throw new Error();
          techArr = techArr.map(t => t.trim()).filter(Boolean);
        } catch {
          techArr = technologies.split(",").map(t => t.trim()).filter(Boolean);
        }
      }

      if (!Array.isArray(techArr) || techArr.length === 0) {
        return res.status(400).json(
          new ApiError(400, "Technologies must be a non-empty array")
        );
      }

      update.technologies = techArr;
    }

    // 6️⃣ Perform DB update
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      update, 
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    ).lean();

    if (!updatedProject) {
      return res.status(404).json(
        new ApiError(404, "Project not found")
      );
    }

    return res.status(200).json(
      new ApiRespose(200, updatedProject, "Project updated successfully")
    );
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json(
      new ApiError(500, "Internal Server Error", err.message)
    );
  }
};



/* ─────────────── DELETE ─────────────── */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid project ID format."));
    }

    const deleted = await Project.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json(new ApiError(404, "Project not found."));
    }

    return res
      .status(200)
      .json(new ApiRespose(200, deleted, "Project deleted successfully."));
  } catch (err) {
    console.error("deleteProject error:", err);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", "Error deleting project.")
      );
  }
};

/* ─────────────── GET ALL ─────────────── */
export const getAllProjects = async (req, res) => {
  try {
    const { archived, category, search } = req.query;
    const query = {};

    // Use isArchived instead of archived
    if (archived === "true") query.isArchived = true;
    if (archived === "false") query.isArchived = false;

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Only populate category, not technologies
    const projects = await Project.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiRespose(200, { projects }, "Projects fetched successfully"));
  } catch (error) {
    console.error("[getAllProjects] error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch projects", error.message));
  }
};

export const projectIsArchived = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the current archived status
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Toggle the archived status
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { isArchived: !existingProject.isArchived },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: `Project ${
        updatedProject.isArchived ? "archived" : "unarchived"
      } successfully`,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error archiving project:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAllArchivedAndFeatured = async (req, res) => {
  try {
    // Run both queries in parallel for speed
    const [archivedProjects, featuredProjects] = await Promise.all([
      Project.find({ isArchived: true })
        .populate("category", "name")
        // .populate("technologies", "name") // ⬅️ keep only if technologies are ObjectIds
        .sort({ createdAt: -1 }),

      Project.find({ isFeatured: true })
        .populate("category", "name")
        // .populate("technologies", "name")
        .sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      archivedCount: archivedProjects.length,
      archivedProjects,
      featuredCount: featuredProjects.length,
      featuredProjects,
    });
  } catch (error) {
    console.error("[getAllArchivedAndFeatured] error:", error);
    return res.status(500).json({
      message: "Failed to fetch archived and featured projects",
      error: error.message,
    });
  }
};