import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiTrash,
  FiArchive,
  FiX,
  FiSave,
  FiPlus,
  FiUpload,
  FiImage
} from "react-icons/fi";

const BASE_URL=import.meta.env.VITE_API_BASE_URL


const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    githubLink: "",
    liveLink: "",
    category: "",
    technologies: [],
    isArchived: false,
    isFeatured: false,
  });

  const [newTech, setNewTech] = useState("");

  const getCategoryName = (category) => {
    if (!category) return "N/A";
    if (typeof category === "object" && category.name) {
      return category.name;
    }
    if (typeof category === "string") {
      const skill = skills.find(s => s._id === category);
      return skill ? skill.name : category;
    }
    return "N/A";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const projectsRes = await axios.get(`${BASE_URL}/public/projects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const projectsData = projectsRes.data?.data?.projects || [];
        
        const skillsRes = await axios.get(`${BASE_URL}/public/skills`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const skillsData = skillsRes.data?.data?.skills || [];

        setProjects(projectsData);
        setSkills(skillsData);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Set preview URL when form data changes
    setPreviewUrl(formData.image);
  }, [formData.image]);

  const handleEdit = (project) => {
    setEditingProject(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      category: project.category?._id || project.category || "",
      technologies: [...project.technologies],
      isArchived: project.isArchived || false,
      isFeatured: project.isFeatured || false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTech = () => {
    if (newTech.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const handleRemoveTech = (index) => {
    setFormData((prev) => {
      const newTechs = [...prev.technologies];
      newTechs.splice(index, 1);
      return { ...prev, technologies: newTechs };
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${BASE_URL}/admin/upload-project-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.data.url;
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setUploadingImage(false);
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Failed to upload image. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const token = localStorage.getItem("adminToken");
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      } 
    };

    try {
      const payload = { ...formData };

      if (!Array.isArray(payload.technologies)) {
        if (typeof payload.technologies === "string") {
          payload.technologies = payload.technologies.split(",").map(t => t.trim());
        } else {
          payload.technologies = [];
        }
      }

      if (editingProject && editingProject !== "new") {
        await axios.patch(
          `${BASE_URL}/admin/projects/${editingProject}`,
          payload,
          config
        );
      } else {
        await axios.post(
          `${BASE_URL}/admin/projects`,
          payload,
          config
        );
      }

      const refreshed = await axios.get(
        `${BASE_URL}/public/projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProjects(refreshed.data?.data?.projects || []);
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project", err.response || err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to save project. Please check all required fields."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (id) => {
    setIsArchiving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const project = projects.find(p => p._id === id);
      if (!project) return;

      await axios.patch(
        `${BASE_URL}/admin/projects/${id}/archive`,
        { isArchived: !project.isArchived },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(prev =>
        prev.map(p =>
          p._id === id ? { ...p, isArchived: !p.isArchived } : p
        )
      );
    } catch (err) {
      console.error("Archive error", err);
      setError(
        err.response?.data?.message || "Failed to update archive status"
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setIsDeleting(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${BASE_URL}/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      console.error("Delete error", err);
      setError(err.response?.data?.message || "Failed to delete project");
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

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-indigo-800">All Projects</h1>
        <button
          onClick={() => {
            setEditingProject("new");
            setFormData({
              title: "",
              description: "",
              image: "",
              githubLink: "",
              liveLink: "",
              category: "",
              technologies: [],
              isArchived: false,
              isFeatured: false,
            });
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
        >
          <FiPlus className="text-lg" />
          <span>Add Project</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          projects.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{p.title}</h3>
                    <p className="text-gray-600">{getCategoryName(p.category)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 hover:bg-indigo-50 rounded-full text-indigo-600"
                      title="Edit"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleArchive(p._id)}
                      className="p-1.5 hover:bg-yellow-50 rounded-full text-yellow-600"
                      title={p.isArchived ? "Unarchive" : "Archive"}
                      disabled={isArchiving}
                    >
                      <FiArchive className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 hover:bg-red-50 rounded-full text-red-600"
                      title="Delete"
                      disabled={isDeleting}
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      p.isArchived
                        ? "bg-yellow-100 text-yellow-800"
                        : p.isFeatured
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {p.isArchived
                      ? "Archived"
                      : p.isFeatured
                      ? "Featured"
                      : "Active"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 font-medium text-gray-700">Category</th>
              <th className="px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.length ? (
              projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-gray-600">{getCategoryName(p.category)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.isArchived
                          ? "bg-yellow-100 text-yellow-800"
                          : p.isFeatured
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {p.isArchived
                        ? "Archived"
                        : p.isFeatured
                        ? "Featured"
                        : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 hover:bg-indigo-50 rounded-md text-indigo-600"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleArchive(p._id)}
                        className="p-1.5 hover:bg-yellow-50 rounded-md text-yellow-600"
                        title={p.isArchived ? "Unarchive" : "Archive"}
                        disabled={isArchiving}
                      >
                        <FiArchive className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 hover:bg-red-50 rounded-md text-red-600"
                        title="Delete"
                        disabled={isDeleting}
                      >
                        <FiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Project */}
      {editingProject !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingProject === "new" ? "Add New Project" : "Edit Project"}
                </h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      {skills.map((skill) => (
                        <option key={skill._id} value={skill._id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Image *
                  </label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                      ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*"
                    />
                    
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt={`Preview for ${formData.title || 'project'}`} 
                          className="max-w-full max-h-48 mx-auto rounded-md mb-3"
                        />
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current.click();
                            }}
                          >
                            <FiUpload size={14} />
                            <span>Change</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrl("");
                              setFormData(prev => ({ ...prev, image: "" }));
                            }}
                          >
                            <FiX size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <FiImage size={32} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-700">
                            {uploadingImage ? "Uploading image..." : "Drag & drop your image here"}
                          </p>
                          <p className="text-sm text-gray-500">
                            or click to browse files
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Supports JPG, PNG up to 5MB
                          </p>
                        </div>
                        <button
                          type="button"
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 mx-auto"
                        >
                          <FiUpload />
                          <span>Select Image</span>
                        </button>
                      </div>
                    )}
                    
                    {uploadingImage && (
                      <div className="mt-3">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full animate-pulse w-1/2"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Link *
                    </label>
                    <input
                      type="text"
                      name="githubLink"
                      required
                      value={formData.githubLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Link *
                    </label>
                    <input
                      type="text"
                      name="liveLink"
                      required
                      value={formData.liveLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a technology"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(index)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleCheckboxChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isArchived"
                      checked={formData.isArchived}
                      onChange={handleCheckboxChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Archived</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center transition-colors"
                    disabled={isSubmitting || uploadingImage}
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Project
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
};

export default AllProjects;