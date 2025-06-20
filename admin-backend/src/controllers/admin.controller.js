import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../services/ApiError.js";
import { ApiRespose } from "../services/ApiResponse.js";
import {AdminAccount as Admin } from "../model/adminAccount.model.js";

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById("68551bce56225de26641d8da").select("-password");
   
    if (!admin) {
      return res.status(404).json(new ApiError(404, "Admin not found"));
    }

    return res.status(200).json(new ApiRespose(200, admin));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch admin profile"));
  }
};
// admin.controller.js
const updateAdminProfile = async (req, res) => {
  // Add authentication check
  if (!req.admin || !req.admin._id) {
    return res.status(401).json(
      new ApiError(401, "Unauthorized: Admin not authenticated")
    );
  }

  const { name } = req.body;

  try {
    if (!name || name.trim() === "") {
      return res.status(400).json(new ApiError(400, "Name is required"));
    }
    if (!req.admin || !req.admin._id) {
    return res.status(401).json(
      new ApiError(401, "Unauthorized: Admin not authenticated")
    );
  }

    // Use req.admin._id here
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin._id,  // 👈 Now using the correct property
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json(new ApiError(404, "Admin not found"));
    }

    return res.status(200).json(
      new ApiRespose(200, updatedAdmin, "Profile updated successfully")
    );
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(new ApiError(400, errors.join(', ')));
    }
    return res.status(500).json(
      new ApiError(500, error.message || "Failed to update profile")
    );
  }
};
const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Both old and new passwords are required"));
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json(new ApiError(404, "Admin not found"));
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, "Old password is incorrect"));
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    const { password, ...adminWithoutPassword } = admin.toObject();
    return res
      .status(200)
      .json(
        new ApiRespose(
          200,
          adminWithoutPassword,
          "Password updated successfully"
        )
      );
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json(new ApiError(500, "Failed to change password"));
  }
};

const getDashboard = async (req, res) => {
  try {
    const dashboardData = {
      users: 1500,
      revenue: "$45,230",
      conversion: 4.5,
    };

    return res
      .status(200)
      .json(new ApiRespose(200, dashboardData, "Dashboard data fetched"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch dashboard data"));
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email and password are required",
        success: false
      });
    }

    // Case-insensitive email search
    console.log(await Admin.findOne({ email: email.toLowerCase() }))
    const admin=await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
        success: false
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password.trim(), admin.password);
    if (!passwordMatch) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
        success: false
      });
    }

    // Verify JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({
        statusCode: 500,
        message: "Server configuration error",
        success: false
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        _id: admin._id, 
        email: admin.email, 
        role: "admin" 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" }
    );

    // Prepare safe admin object
    const safeAdmin = admin.toObject();
    delete safeAdmin.password;

    return res.status(200).json({
      statusCode: 200,
      data: { 
        profile: safeAdmin, 
        token
      },
      message: "Login successful",
      success: true
    });
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      success: false
    });
  }
};

const uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.admin || !req.admin._id) {
    return res.status(401).json(
      new ApiError(401, "Unauthorized: Admin not authenticated")
    );
  }
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "Avatar file is required"));
    }

    const absoluteUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { avatar: absoluteUrl },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res
        .status(404)
        .json(new ApiError(404, "Admin not found"));
    }

    return res.status(200).json(
      new ApiRespose(
        200,
        { url: absoluteUrl, profile: updatedAdmin },
        "Avatar uploaded successfully"
      )
    );
  } catch (error) {
    console.error("Avatar upload error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to upload avatar"));
  }
};

export {
  getAdminProfile,
  updateAdminProfile,
  getDashboard,
  changeAdminPassword,
  loginAdmin,
  uploadAdminAvatar
};