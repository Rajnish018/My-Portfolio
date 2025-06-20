import { Certification } from '../model/certification.model.js'; // adjust path as needed
import { ApiError } from '../services/ApiError.js';
import { ApiRespose } from '../services/ApiResponse.js';

/* ──────────────── CREATE ──────────────── */
export const createCertification = async (req, res) => {
  try {
    const { name, issurer, year } = req.body;

    if (!name || !issurer || !year) {
      return res.status(400).json(
        new ApiError(400, 'All fields are required: name, issurer, and year.')
      );
    }

    const cert = await Certification.create({
      name: name.trim(),
      issurer: issurer.trim(),
      year: year.trim(),
    });

    return res.status(201).json(
      new ApiRespose(201, cert, 'Certification created successfully.')
    );
  } catch (err) {
    console.error('createCertification error:', err);
    return res.status(500).json(
      new ApiError(
        500,
        'Internal Server Error',
        'An error occurred while creating the certification.'
      )
    );
  }
};

/* ──────────────── UPDATE ──────────────── */
export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, issurer, year } = req.body;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(400, 'Invalid ID format. Must be a 24-character hex string.')
      );
    }

    if (!name && !issurer && !year) {
      return res.status(400).json(
        new ApiError(400, 'Provide at least one field to update.')
      );
    }

    const update = {};
    if (name)    update.name = name.trim();
    if (issurer) update.issurer = issurer.trim();
    if (year)    update.year = year.trim();

    const updated = await Certification.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    }).lean();

    if (!updated) {
      return res.status(404).json(
        new ApiError(404, 'Certification not found.')
      );
    }

    return res.status(200).json(
      new ApiRespose(200, updated, 'Certification updated successfully.')
    );
  } catch (err) {
    console.error('updateCertification error:', err);
    return res.status(500).json(
      new ApiError(500, 'Internal Server Error', 'Error updating certification.')
    );
  }
};

/* ──────────────── DELETE ──────────────── */
export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(
        new ApiError(400, 'Invalid ID format. Must be a 24-character hex string.')
      );
    }

    const deleted = await Certification.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json(
        new ApiError(404, 'Certification not found.')
      );
    }

    return res.status(200).json(
      new ApiRespose(200, deleted, 'Certification deleted successfully.')
    );
  } catch (err) {
    console.error('deleteCertification error:', err);
    return res.status(500).json(
      new ApiError(500, 'Internal Server Error', 'Error deleting certification.')
    );
  }
};
/* ──────────────── GET ──────────────── */
export const getAllCertifications = async (req, res) => {
  try {
    const { search = "", sort = "-year" } = req.query;


    const query = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { issurer: regex }];
    }

    const certs = await Certification.find(query)
      .sort(sort)   // e.g. "-year" or "name"
      .lean();

  console.log("GET /cerifications query:" )


    return res
      .status(200)
      .json(new ApiRespose(200, certs, "Certifications fetched successfully."));
  } catch (err) {
    console.error("[getAllCertifications] error:", err);
    return res.status(500).json(
      new ApiError(
        500,
        "Internal Server Error",
        "An error occurred while fetching certifications."
      )
    );
  }
};
