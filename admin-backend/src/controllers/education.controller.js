// controllers/education.controller.js
import { Education } from '../model/education.model.js';   // adjust the path if needed
import { ApiError } from '../services/ApiError.js';
import { ApiRespose } from '../services/ApiResponse.js';

/* ─────────────────────────────────────────────────────────────
   CREATE:  POST /api/v1/education
   Body { degree, institution, year, achievements }
   ───────────────────────────────────────────────────────────── */
export const createEducation = async (req, res) => {
  try {
    const { degree, institution, year, achievements } = req.body;

    // 1. Guard clauses
    if (!degree || !institution || !year || !achievements) {
      return res.status(400).json(
        new ApiError(
          400,
          'All fields are required. Please provide degree, institution, year, and achievements.'
        )
      );
    }

    // 2. Persist
    const edu = await Education.create({
      degree: degree.trim(),
      institution: institution.trim(),
      year: year.trim(),
      achievements: achievements.trim(),
    });

    // 3. Respond
    return res.status(201).json(
      new ApiRespose(201, edu, 'Education record created successfully.')
    );
  } catch (err) {
    console.error('createEducation error:', err);
    return res.status(500).json(
      new ApiError(
        500,
        'Internal Server Error',
        'An unexpected error occurred while creating the education record.'
      )
    );
  }
};

/* ─────────────────────────────────────────────────────────────
   UPDATE:  PATCH /api/v1/education/:id
   Body can include any subset of { degree, institution, year, achievements }
   ───────────────────────────────────────────────────────────── */
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('updateEducation request body:', req.body);
    const { degree, institution, year, achievements } = req.body;
    console.log('updateEducation fields:', { degree, institution, year, achievements });

    // 1. Validate ID
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(
          400,
          'Invalid education ID format. Please provide a valid 24‑character hex string.'
        )
      );
    }

    // 2. Ensure at least one field to update
    if (!degree && !institution && !year && !achievements) {
      return res.status(400).json(
        new ApiError(
          400,
          'No fields provided to update. Supply at least one of: degree, institution, year, achievements.'
        )
      );
    }

    // 3. Build update object
    const update = {};
    if (degree)       update.degree       = degree.trim();
    if (institution)  update.institution  = institution.trim();
    if (year)         update.year         = year.trim();
    if (achievements) update.achievements = achievements.trim();

    // 4. Apply update
    const updated = await Education.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true, context: 'query' }
    ).lean();

    // 5. Handle not‑found
    if (!updated) {
      return res.status(404).json(
        new ApiError(404, 'Education record not found. Please check the ID and try again.')
      );
    }

    // 6. Success
    return res.status(200).json(
      new ApiRespose(200, updated, 'Education record updated successfully.')
    );
  } catch (err) {
    console.error('updateEducation error:', err);
    return res.status(500).json(
      new ApiError(
        500,
        'Internal Server Error',
        'An unexpected error occurred while updating the education record.'
      )
    );
  }
};

/* ─────────────────────────────────────────────────────────────
   DELETE:  DELETE /api/v1/education/:id
   ───────────────────────────────────────────────────────────── */
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(
          400,
          'Invalid education ID format. Please provide a valid 24‑character hex string.'
        )
      );
    }

    // 2. Attempt delete
    const deleted = await Education.findByIdAndDelete(id).lean();

    // 3. Not found
    if (!deleted) {
      return res.status(404).json(
        new ApiError(404, 'Education record not found. Please check the ID and try again.')
      );
    }

    // 4. Success
    return res.status(200).json(
      new ApiRespose(200, deleted, 'Education record deleted successfully.')
    );
  } catch (err) {
    console.error('deleteEducation error:', err);
    return res.status(500).json(
      new ApiError(
        500,
        'Internal Server Error',
        'An unexpected error occurred while deleting the education record.'
      )
    );
  }
};

export const getAllEducation = async (req, res) => {
  try {
    const { search = "", sort = "-year" } = req.query;

    const query = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ degree: regex }, { institution: regex }];
    }

    const educations = await Education.find(query).sort(sort).lean();

    console.log("GET /education")


    return res.status(200).json(
      new ApiRespose(200, educations, "Education records fetched successfully.")
    );
  } catch (err) {
    console.error("[getAllEducation] error:", err);
    return res.status(500).json(
      new ApiError(
        500,
        "Internal Server Error",
        "An error occurred while retrieving education records."
      )
    );
  }
};

export const getPublicEducation = async (req, res) => {
  console.log("🔓 getPublicEducation reached");

  try {
    const education = await Education.find().sort({ year: -1 });

    console.log(education)

    res.status(200).json({ data: education, success: true });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

