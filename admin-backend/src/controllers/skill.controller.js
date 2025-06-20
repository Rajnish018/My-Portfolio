import { ApiError } from '../services/ApiError.js';
import { ApiRespose } from '../services/ApiResponse.js';
import {Skill} from '../model/skill.model.js';



const createSkill = async (req, res) => {
  try {
    const { name, icon, items, color } = req.body;
    console.log('createSkill request body:', req.body);

    /* ───── 1. Guard clauses ───── */
    if (!name || !icon || !items || !color) {
      return res
        .status(400)
        .json(new ApiError(400, 'All fields are required. Please provide name, icon, items, and color.'));
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, 'Items must be a non-empty array. Please provide at least one item.'));
    }

    /* ───── 2. Check for duplicate name ───── */
    const existing = await Skill.findOne({ name: name.trim() });
    if (existing) {
      
        return res
        .status(409)
        .json(new ApiError(409, `A skill category called “${name}” already exists.`),
            
        );
    }

    /* ───── 3. Build the doc ───── */
    const skill = await Skill.create({
      name:  name.trim(), // normalize to lowercase
      icon:  icon.trim(),
      color: color.trim(),
      items: items
    .map((it) => {
      if (typeof it === "string") return { name: it.trim() };     // "Nodejs"
      if (it && typeof it === "object" && "name" in it)
        return { name: String(it.name).trim() };                  // {name:"Nodejs"}
      return null;                                                // ignore invalid
    })
    .filter(Boolean),        
    });

    return res
    .status(200)
    .json(
        new ApiRespose(
            200,
             skill,
            'Skill  created successfully.',
        )
    ); // 201 = “Created”
  } catch (err) {
    console.error('createSkill error:', err);
    return res
      .status(500)
      .json(
        new ApiError(500,
            'Internal Server Error',
            'An unexpected error occurred while creating the skill category.'
            )
      );
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('deleteSkill request params:', req.params);

    /* ───── 1. Basic validation ───── */
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(400, 'Invalid skill category ID format. Please provide a valid 24-character hex string.'),
      );
    }

    /* ───── 2. Attempt deletion ───── */
    const deleted = await Skill.findByIdAndDelete(id).lean();

    /* ───── 3. Handle “not found” ───── */
    if (!deleted) {
      return res.status(404).json(new ApiError(404, 'Skill category not found. Please check the ID and try again.'));
    }

    /* ───── 4. Success ───── */
    return res.status(200).json(
        new ApiRespose(
      200,
        deleted, `Skill category “${deleted.name}” deleted successfully.`,
        )
    );
  } catch (err) {
    console.error('deleteSkill error:', err);
    return res.status(500).json(
      new ApiError(500, 'Internal Server Error', 'An unexpected error occurred while deleting the skill category.'),
    );
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('updateSkill request params:', req.params);
    const { name, icon, items, color } = req.body;

    console.log('updateSkill request body:', req.body);

    /* ───── 1. Validate ID ───── */
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(
          400,
          'Invalid skill category ID format. Please provide a valid 24‑character hex string.'
        )
      );
    }

    /* ───── 2. Ensure there is something to update ───── */
    if (!name && !icon && !items && !color) {
      return res.status(400).json(
        new ApiError(
          400,
          'No fields provided to update. Supply at least one of: name, icon, items, color.'
        )
      );
    }

    /* ───── 3. Validate items array if supplied ───── */
    if (items && (!Array.isArray(items) || items.length === 0)) {
      return res.status(400).json(
        new ApiError(
          400,
          'Items must be a non‑empty array when provided.'
        )
      );
    }

    /* ───── 4. Check duplicate name if name is changing ───── */
    if (name) {
      const duplicate = await Skill.findOne({
        _id: { $ne: id },
        name: name.trim(),
      });
      if (duplicate) {
        return res.status(409).json(
          new ApiError(
            409,
            `A skill category called “${name}” already exists.`
          )
        );
      }
    }

    /* ───── 5. Build update object ───── */
    const update = {};
    if (name)  update.name  = name.trim();
    if (icon)  update.icon  = icon.trim();
    if (color) update.color = color.trim();
    if (items) {
  // 1 accept JSON string, comma list, or array
  let parsed = items;
  if (typeof items === "string") {
    try {
      parsed = JSON.parse(items);          // '["React","Redux"]'
    } catch {
      parsed = items.split(",");           // "React,Redux"
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Items must be a non‑empty array."));
  }

  // 2 normalise each entry to { name: string }
  update.items = parsed
    .map((el) => {
      if (typeof el === "string") return { name: el.trim() };
      if (el && typeof el === "object" && "name" in el)
        return { name: String(el.name).trim() };
      return null;                         // drop invalid entries
    })
    .filter(Boolean);

  if (update.items.length === 0)
    return res
      .status(400)
      .json(new ApiError(400, "Items array contained no valid names."));
}

    /* ───── 6. Apply update ───── */
    const updated = await Skill.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,            // return the modified document
        runValidators: true,  // respect schema rules
        context: 'query',
      }
    ).lean();

    /* ───── 7. Not found? ───── */
    if (!updated) {
      return res.status(404).json(
        new ApiError(404, 'Skill category not found. Please check the ID and try again.')
      );
    }

    /* ───── 8. Success ───── */
    return res.status(200).json(
      new ApiRespose(
        200,
        updated,
        `Skill  “${updated.name}” updated successfully.`
      )
    );
  } catch (err) {
    console.error('updateSkill error:', err);
    return res.status(500).json(
      new ApiError(
        500,
        'Internal Server Error',
        'An unexpected error occurred while updating the skill category.'
      )
    );
  }
}


const getAllSkill = async (req, res) => {
  try {
    // ─── 1. Pagination helpers ─────────────────────────────────────
    const page  = Math.max(parseInt(req.query.page  || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
    const skip  = (page - 1) * limit;

    // ─── 2. Fetch skills ───────────────────────────────────────────
    const [skills, total] = await Promise.all([
      Skill.find()
        .sort({ createdAt: -1 })  // newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Skill.countDocuments(),
    ]);
console.log("GET /skills called");

    // ─── 3. Return response ────────────────────────────────────────
    return res.status(200).json(
      new ApiRespose(200, {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Skills fetched successfully.")
    );
  } catch (err) {
    console.error("getAllSkill error:", err);
    return res.status(500).json(
      new ApiError(500, "Internal Server Error", "Error fetching skills.")
    );
  }
};





export {
    createSkill,
    deleteSkill,
    updateSkill,
    getAllSkill,
}