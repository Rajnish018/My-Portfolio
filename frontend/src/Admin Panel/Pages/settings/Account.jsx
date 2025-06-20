import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSave, FiEye, FiEyeOff, FiLock } from "react-icons/fi";

export default function Account() {
  const [passwords, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const changePw = async (e) => {
    e.preventDefault();

    if (passwords.next !== passwords.confirm) {
      setMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwords.next.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      await axios.post(
        "https://my-portfolio-zp97.onrender.com/api/v1/admin/change-password",
        {
          oldPassword: passwords.current,
          newPassword: passwords.next,
        },
        cfg()
      );

      setMsg({ type: "success", text: "Password updated successfully" });
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update password";
      setMsg({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
      setTimeout(() => {
        setMsg({ type: "", text: "" });
      }, 5000);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <motion.div
      className="p-4 min-h-screen flex flex-col"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full mx-auto flex-grow flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FiLock className="text-indigo-600 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        </div>

        {msg.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              msg.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Change Password
          </h2>

          <form
            onSubmit={changePw}
            className="space-y-4 flex-grow flex flex-col"
          >
            <div className="space-y-4">
              {[
                ["current", "Current Password"],
                ["next", "New Password"],
                ["confirm", "Confirm New Password"],
              ].map(([key, label]) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[key] ? "text" : "password"}
                      name={key}
                      required
                      value={passwords[key]}
                      onChange={(e) =>
                        setPw((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(key)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                    >
                      {showPassword[key] ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">
                  Password Requirements:
                </p>
                <ul className="mt-1 text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>At least 6 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                  <li>Consider adding special characters</li>
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
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
                    Updating...
                  </div>
                ) : (
                  <>
                    <FiSave size={18} /> Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="py-4 text-center text-sm text-gray-500">
          <p>For security, please keep your credentials confidential</p>
        </div>
      </div>
    </motion.div>
  );
}