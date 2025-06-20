import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/admin/projects/archived-featured",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(Array.isArray(data.featuredProjects) ? data.featuredProjects : []);
      } catch (err) {
        console.error("Failed to fetch featured projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getCategoryName = (category) => {
    if (!category) return 'N/A';
    if (typeof category === 'object' && category.name) return category.name;
    return 'N/A';
  };

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">Featured Projects</h1>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No featured projects found</p>
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
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{p.title}</h3>
                  <p className="text-gray-600">{getCategoryName(p.category)}</p>
                </div>
                
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Featured
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.length ? (
              projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-gray-600">{getCategoryName(p.category)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Featured
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No featured projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;