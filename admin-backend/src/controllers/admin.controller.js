import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ApiError } from "../services/ApiError.js";
import { ApiRespose } from "../services/ApiResponse.js";

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILE_PATH = path.join(__dirname, "..", "data", "adminProfile.json");

// Initialize admin profile file
const initAdminProfile = () => {
  if (!fs.existsSync(path.dirname(PROFILE_PATH))) {
    fs.mkdirSync(path.dirname(PROFILE_PATH), { recursive: true });
  }

  if (!fs.existsSync(PROFILE_PATH)) {
    const defaultProfile = {
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      avatar: "",
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(defaultProfile, null, 2));
  } else {
    // Ensure existing profile has password
    try {
      const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf8"));
      if (!profile.password) {
        profile.password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
        fs.writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2));
        console.log("Added missing password to admin profile");
      }
    } catch (err) {
      console.error("Error checking admin profile:", err);
    }
  }
};

initAdminProfile();

// Helper functions for profile management
const readAdminProfileFromFile = () => {
  try {
    const data = fs.readFileSync(PROFILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading admin profile:", err);
    throw new ApiError(500, "Failed to load admin profile");
  }
};

const updateAdminProfileInFile = (updates, { allowPassword = false } = {}) => {
  try {
    const currentProfile = readAdminProfileFromFile();

    const protectedFields = ["email", "createdAt"];
    if (!allowPassword) protectedFields.push("password"); // 🚩

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(
        ([key]) => !protectedFields.includes(key)
      )
    );

    const updatedProfile = { ...currentProfile, ...filteredUpdates };
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(updatedProfile, null, 2));
    return updatedProfile;
  } catch (err) {
    console.error("Error updating admin profile:", err);
    throw new ApiError(500, "Failed to update admin profile");
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const profile = readAdminProfileFromFile();
    // Remove password before sending response
    const { password, ...profileWithoutPassword } = profile;
    return res.status(200).json(new ApiRespose(200, profileWithoutPassword));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch admin profile"));
  }
};

const updateAdminProfile = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    if (!name) {
      return res.status(400).json(new ApiError(400, "Name is required"));
    }

    const updatedProfile = updateAdminProfileInFile({ name, avatar });

    // Remove password before sending response
    const { password, ...profileWithoutPassword } = updatedProfile;
    return res
      .status(200)
      .json(
        new ApiRespose(
          200,
          profileWithoutPassword,
          "Profile updated successfully"
        )
      );
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json(new ApiError(500, "Failed to update profile"));
  }
};

const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  console.log("Change password request:", req.body);
const profile = readAdminProfileFromFile();
console.log("Current profile:", profile);
  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Both old and new passwords are required"));
    }

    const profile = readAdminProfileFromFile();

    console.log("Current profile:", profile);
    const isMatch = await bcrypt.compare(oldPassword, profile.password);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, "Old password is incorrect"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedProfile = updateAdminProfileInFile({
      password: hashedPassword,

    }, { allowPassword: true } );

    // Remove password before sending response
    const { password, ...profileWithoutPassword } = updatedProfile;
    console.log("Updated profile without password:", profileWithoutPassword);
    return res
      .status(200)
      .json(
        new ApiRespose(
          200,
          profileWithoutPassword,
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
    // Placeholder dashboard data
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

    // Add more robust validation
    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email and password are required",
        success: false
      });
    }

    const profile = readAdminProfileFromFile();

    // Add null checks for profile
    if (!profile || !profile.email || !profile.password) {
      return res.status(500).json({
        statusCode: 500,
        message: "Admin profile configuration error",
        success: false
      });
    }

    const emailMatch = email === profile.email;
    const passwordMatch = await bcrypt.compare(password, profile.password);

    if (!emailMatch || !passwordMatch) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
        success: false
      });
    }

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({
        statusCode: 500,
        message: "Server configuration error",
        success: false
      });
    }

    const token = jwt.sign(
      { email: profile.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" }
    );

    const { password: _, ...safeProfile } = profile;

    return res.status(200).json({
      statusCode: 200,
      data: { 
        profile: safeProfile, 
        token  // Ensure token is sent in response
      },
      message: "Login successful",
      success: true
    });
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      statusCode: 500,
      message: err.message || "Login failed",
      success: false
    });
  }
};

// controller/admin.controller.js
// import { ApiError }     from "../services/ApiError.js";
// import { ApiResponse }  from "../services/ApiResponse.js";
// import { updateAdminProfileInFile } from "../utils/profileStore.js"; // adjust path

const uploadAdminAvatar = async (req, res) => {
  try {
    // 1. Ensure file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "Avatar file is required"));
    }

    // 2. Build relative and absolute paths
    const avatarPath = `/uploads/${req.file.filename}`;
    const absoluteUrl = `${req.protocol}://${req.get("host")}${avatarPath}`;

    // 3. Save avatarPath or absoluteUrl to profile file/database
    const updatedProfile = updateAdminProfileInFile({ avatar: absoluteUrl }); // ✅ Store absolute URL
    if (!updatedProfile) {
      return res
        .status(500)
        .json(new ApiError(500, "Failed to update profile with avatar"));
    }

    // 4. Strip password (if any) and return updated profile
    const { password, ...profileWithoutPassword } = updatedProfile;

    return res.status(200).json(
      new ApiRespose(
        200,
        { url: absoluteUrl, profile: profileWithoutPassword }, // ✅ Return usable avatar URL
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
