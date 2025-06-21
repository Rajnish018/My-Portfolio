import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiX, FiSave, FiPlus } from "react-icons/fi";

const BASE_URL=import.meta.env.VITE_API_BASE_URL


export default function EducationAdmin() {
  // ─────────────── state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    year: "",
    achievements: "", // Now always a string
  });

  // ─────────────── effects
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(
          `${BASE_URL}/admin/education`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const list = Array.isArray(data?.data) ? data.data : data.educations ?? [];
        setRecords(list);
      } catch (err) {
        setError("Failed to load education records.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─────────────── handlers
  const openNew = () => {
    setEditingId("");
    setForm({ degree: "", institution: "", year: "", achievements: "" });
  };

  const openEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      ...rec,
      // Convert array to string with newline separation
      achievements: Array.isArray(rec.achievements) 
        ? rec.achievements.join("\n") 
        : rec.achievements
    });
  };

  const closeModal = () => {
    setEditingId(null);
    setForm({ degree: "", institution: "", year: "", achievements: "" });
  };

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ─────────────── submit function
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const token = localStorage.getItem("adminToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingId) {
        await axios.patch(
          `${BASE_URL}/admin/education/${editingId}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${BASE_URL}/admin/education`,
          form,
          config
        );
      }

      const { data } = await axios.get(
        `${BASE_URL}/admin/education`, 
        config
      );
      setRecords(Array.isArray(data?.data) ? data.data : data.educations ?? []);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────── delete function
  const del = async (id) => {
    if (!window.confirm("Delete this education entry?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${BASE_URL}/admin/education/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record.");
    }
  };

  // ─────────────── render
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Education</h1>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full sm:w-auto"
        >
          <FiPlus className="text-lg" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {records.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No education entries found</p>
          </div>
        ) : (
          records.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{r.degree}</h3>
                    <p className="text-gray-600">{r.institution}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 hover:bg-indigo-50 rounded-full text-indigo-600"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => del(r._id)}
                      className="p-1.5 hover:bg-red-50 rounded-full text-red-600"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Year:</span>
                    <span>{r.year}</span>
                  </div>
                  {r.achievements && (
                    <div>
                      <span className="text-gray-500 font-medium">Achievements:</span>
                      <ul className="mt-1 text-gray-700 list-disc list-inside">
                        {Array.isArray(r.achievements)
                          ? r.achievements.map((a, i) => <li key={i}>{a}</li>)
                          : r.achievements.split("\n").map((a, i) => <li key={i}>{a}</li>)
                        }
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Degree</th>
              <th className="px-4 py-3 font-medium text-gray-700">Institution</th>
              <th className="px-4 py-3 font-medium text-gray-700">Year</th>
              <th className="px-4 py-3 font-medium text-gray-700">Achievements</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.length ? (
              records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.degree}</td>
                  <td className="px-4 py-3 text-gray-600">{r.institution}</td>
                  <td className="px-4 py-3 text-gray-600">{r.year}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <ul className="list-disc list-inside">
                      {Array.isArray(r.achievements)
                        ? r.achievements.map((a, i) => <li key={i}>{a}</li>)
                        : r.achievements.split("\n").map((a, i) => <li key={i}>{a}</li>)
                      }
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 hover:bg-indigo-50 rounded-md text-indigo-600"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => del(r._id)}
                        className="p-1.5 hover:bg-red-50 rounded-md text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No education entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingId ? "Edit Education" : "Add Education"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {["degree", "institution", "year"].map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field} *
                    </label>
                    <input
                      type={field === "year" ? "number" : "text"}
                      name={field}
                      required
                      value={form[field]}
                      onChange={onChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
                
                {/* Special handling for achievements textarea */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements *
                  </label>
                  <textarea
                    name="achievements"
                    required
                    value={form.achievements}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter achievements (one per line)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one achievement per line
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}