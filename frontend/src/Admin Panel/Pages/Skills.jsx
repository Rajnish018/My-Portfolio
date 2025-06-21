import React, { useEffect, useState } from "react";
import axios from "axios";
import * as FiIcons from "react-icons/fi";
import { Button } from "../commpenets/Button.jsx";
import { Card, CardContent } from "../commpenets/Card.jsx";
import { motion } from "framer-motion";
const BASE_URL=import.meta.env.VITE_API_BASE_URL

const colorOptions = [
  { class: "bg-indigo-600", name: "Indigo" },
  { class: "bg-blue-600", name: "Blue" },
  { class: "bg-green-600", name: "Green" },
  { class: "bg-yellow-600", name: "Yellow" },
  { class: "bg-red-600", name: "Red" },
  { class: "bg-purple-600", name: "Purple" },
  { class: "bg-pink-600", name: "Pink" },
  { class: "bg-gray-600", name: "Gray" },
  { class: "bg-rose-600", name: "Rose" },
  { class: "bg-amber-600", name: "Amber" },
  { class: "bg-teal-600", name: "Teal" },
  { class: "bg-lime-600", name: "Lime" },
];

const commonIcons = [
  "FiCode", "FiLayout", "FiDatabase", "FiServer", 
  "FiTool", "FiMonitor", "FiSmartphone", "FiGlobe","FiCpu","FiLayers"
];



export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "FiCode",
    color: "bg-indigo-600",
    items: [{ name: "" }],
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found");

      const res = await axios.get(`${BASE_URL}/public/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const skillArray = Array.isArray(res.data?.data?.skills)
        ? res.data.data.skills
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setSkills(skillArray);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load skills. Please ensure you're logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill._id);
    setFormData({
      name: skill.name,
      icon: skill.icon,
      color: skill.color,
      items: skill.items.map(item => ({ ...item })),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (index, value) => {
    const newItems = [...formData.items];
    newItems[index].name = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddTech = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: "" }],
    }));
  };

  const handleRemoveTech = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const items = formData.items.filter(item => item.name.trim() !== "");
    
    const skillData = {
      name: formData.name,
      icon: formData.icon,
      color: formData.color,
      items
    };

    try {
      const token = localStorage.getItem("adminToken");
      
      if (editingSkill) {
        await axios.patch(
          `${BASE_URL}/admin/skills/${editingSkill}`,
          skillData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${BASE_URL}/admin/skills`,
          skillData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      fetchSkills();
      setEditingSkill(null);
      setFormData({
        name: "",
        icon: "FiCode",
        color: "bg-indigo-600",
        items: [{ name: "" }],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save skill.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("adminToken");
      console.log("handle to delete",token)
      await axios.delete(`${BASE_URL}/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete skill.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 sm:p-6"
    >
      {/* Edit Form Modal */}
      {editingSkill !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </h2>
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setFormData({
                      name: "",
                      icon: "FiCode",
                      color: "bg-indigo-600",
                      items: [{ name: "" }],
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiIcons.FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Skill Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {/* Icon Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon *
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {commonIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.class}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          formData.color === color.class 
                            ? "ring-2 ring-offset-2 ring-indigo-500" 
                            : ""
                        }`}
                        onClick={() => 
                          setFormData(prev => ({ ...prev, color: color.class }))
                        }
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies
                  </label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleTechChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Technology name"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveTech(index)}
                        disabled={formData.items.length <= 1}
                        className="shrink-0 mt-2 sm:mt-0"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full sm:w-auto"
                    onClick={handleAddTech}
                  >
                    + Add Technology
                  </Button>
                </div>
                
                {/* Form Actions */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setEditingSkill(null);
                      setFormData({
                        name: "",
                        icon: "FiCode",
                        color: "bg-indigo-600",
                        items: [{ name: "" }],
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="w-full sm:w-auto"
                  >
                    {editingSkill ? "Update Skill" : "Create Skill"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-indigo-800">Skills Management</h1>
        <Button
          onClick={() => setEditingSkill("")}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <FiIcons.FiPlus className="text-lg" />
          <span>New Skill</span>
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Skill</th>
              <th className="px-4 py-3 font-medium text-gray-700">Technologies</th>
              <th className="px-4 py-3 font-medium text-gray-700">Color</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skills.map((skill) => {
              const Icon = FiIcons[skill.icon] || FiIcons.FiBox;
              return (
                <tr 
                  key={skill._id} 
                  className="hover:bg-gray-50"
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className="text-lg text-indigo-600">
                      <Icon />
                    </span>
                    <span className="font-medium text-gray-800">{skill.name}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(skill.items) && 
                        skill.items.map(({ name }) => (
                          <span
                            key={name}
                            className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                          >
                            {name}
                          </span>
                        ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-block w-5 h-5 rounded-full ${skill.color}`} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-indigo-600 hover:bg-indigo-50 border-indigo-600"
                        onClick={() => handleEdit(skill)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(skill._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No skills found</p>
          </div>
        ) : (
          skills.map((skill) => {
            const Icon = FiIcons[skill.icon] || FiIcons.FiBox;
            return (
              <Card key={skill._id} className="p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-indigo-600">
                      <Icon />
                    </span>
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">{skill.name}</h3>
                      <span className={`inline-block w-4 h-4 rounded-full ${skill.color}`} />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(skill.items) && 
                      skill.items.map(({ name }) => (
                        <span
                          key={name}
                          className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full"
                        >
                          {name}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-indigo-600 hover:bg-indigo-50 border-indigo-600"
                    onClick={() => handleEdit(skill)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(skill._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </motion.div>
  );
}