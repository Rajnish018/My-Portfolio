import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSave, FiEdit, FiUpload, FiUser, FiX, FiMail, FiCopy } from "react-icons/fi";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
    createdAt: "",
  });
  const [initialProfile, setInitialProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:8000";

  const config = (isForm = false) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Authentication token missing. Please login again.");
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isForm
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    };
  };

  const getAbsoluteUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/public/profile`,
          config()
        );

        if (!data || !data.data) {
          throw new Error("Invalid profile data structure");
        }

        const profileData = data.data;
        let createdAtStr = "";

        if (profileData.createdAt) {
          try {
            createdAtStr = new Date(profileData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          } catch (e) {
            console.error("Date parsing error:", e);
            createdAtStr = "Unknown date";
          }
        }

        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          avatar: profileData.avatar || "",
          role: profileData.role || "Administrator",
          createdAt: createdAtStr,
        });

        setInitialProfile({
          name: profileData.name || "",
          email: profileData.email || "",
        });

        if (profileData.avatar) {
          setAvatarPreview(getAbsoluteUrl(profileData.avatar));
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarLoadError(false);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/admin/upload-avatar`,
        formData,
        config(true)
      );

      const uploadedUrl = response.data?.data?.url;

      if (!uploadedUrl) {
        throw new Error(
          `Server response didn't contain image URL. Full response: ${JSON.stringify(
            response.data
          )}`
        );
      }

      // Update profile with new avatar URL
      setProfile((prev) => ({ ...prev, avatar: uploadedUrl }));

      // Update localStorage
      const adminProfile = JSON.parse(
        localStorage.getItem("adminProfile") || "{}"
      );
      localStorage.setItem(
        "adminProfile",
        JSON.stringify({
          ...adminProfile,
          avatar: uploadedUrl,
        })
      );

      setSuccess("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      let errorMessage = "Failed to upload avatar";

      if (err.message.includes("Server response")) {
        errorMessage = "Server returned an unexpected response format";
      } else if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          "Server rejected the upload";
      }

      setError(`${errorMessage}. Please try again.`);

      // Revert to previous avatar but keep the preview
      if (profile.avatar) {
        setAvatarPreview(getAbsoluteUrl(profile.avatar));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (profile.name === initialProfile?.name) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/admin/profile`,
        { name: profile.name },
        config()
      );

      const updatedProfile = data.data;
      setSuccess("Profile updated successfully!");

      localStorage.setItem(
        "adminProfile",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("adminProfile")),
          name: updatedProfile.name,
        })
      );

      setInitialProfile({
        name: updatedProfile.name,
        email: updatedProfile.email,
      });

      setProfile((prev) => ({ ...prev, name: updatedProfile.name }));
      setIsEditing(false);
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.response?.data?.message || "Failed to save changes");
    } setSaving(false);
  setTimeout(() => {
    setSuccess(false)
  }, 2000);
    
  
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mt-6 mb-6 flex-wrap">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Admin Profile
        </h1>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              <FiEdit size={18} /> Edit&nbsp;Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <FiX size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${
            error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {error || success}
        </motion.div>
      )}

      {/* Profile Card - Desktop Optimized */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Avatar Section - Desktop Optimized */}
          <div className="w-full lg:w-[35%] bg-gradient-to-br from-indigo-50 to-blue-50 p-6 sm:p-8 flex flex-col items-center">
            <div className="relative mb-6 group w-full max-w-xs">
              <div className="relative flex justify-center">
                {avatarPreview && !avatarLoadError ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                    onError={() => setAvatarLoadError(true)}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-40 h-40 flex items-center justify-center">
                    <FiUser className="text-gray-400 text-4xl" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={triggerFileInput}
                      className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-110"
                      disabled={uploading}
                      aria-label="Upload new avatar"
                    >
                      <FiUpload className="text-indigo-600" size={24} />
                    </button>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>

            {uploading && (
              <div className="text-center text-sm text-indigo-600 mb-3">
                Uploading avatar...
              </div>
            )}

            <div className="text-center w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {profile.name}
              </h2>
              
              {/* Email Display - Desktop Optimized */}
              <div className="bg-white rounded-lg p-3 mt-4 border border-gray-200 w-full max-w-xs mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 flex-1 min-w-0">
                    <FiMail className="text-indigo-500 flex-shrink-0" />
                    <span className="text-sm truncate">{profile.email}</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <div className="mt-1 text-xs text-green-600 text-center">
                    Copied to clipboard!
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs mx-auto">
                <div className="bg-indigo-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-indigo-700 font-medium">Role</p>
                  <p className="text-sm font-medium text-gray-800">{profile.role}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-indigo-700 font-medium">Member Since</p>
                  <p className="text-sm font-medium text-gray-800">{profile.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section - Desktop Optimized */}
          <div className="w-full lg:w-[65%] p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field - Desktop Optimized */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <FiMail className="text-indigo-500" /> Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      disabled
                      value={profile.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed pr-10 text-gray-700"
                      placeholder="Your email address"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Email cannot be changed for security reasons. Contact support if you need assistance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-1/3 text-sm text-gray-600">Full Name</div>
                        <div className="w-2/3 text-base font-medium text-gray-800">
                          {profile.name}
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-1/3 text-sm text-gray-600">Role</div>
                        <div className="w-2/3 text-base font-medium text-gray-800">
                          {profile.role}
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-1/3 text-sm text-gray-600">Member Since</div>
                        <div className="w-2/3 text-base font-medium text-gray-800">
                          {profile.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                    <h3 className="text-sm font-medium text-indigo-800 mb-2">
                      Account Security
                    </h3>
                    <p className="text-sm text-indigo-700">
                      For your security, never share your admin credentials. Use a strong password 
                      and enable two-factor authentication if available. Regularly update your password 
                      and be cautious of phishing attempts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}