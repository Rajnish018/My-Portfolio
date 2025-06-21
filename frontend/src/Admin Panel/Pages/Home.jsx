// DashboardHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiFolder,
  FiAward,
  FiMail,
  FiUsers,
  FiPlusCircle,
  FiMessageSquare,
  FiChevronRight,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { Card, CardContent } from "../commpenets/Card.jsx";
import { Button } from "../commpenets/Button.jsx";
import { motion } from "framer-motion";

const BASE_URL=import.meta.env.VITE_API_BASE_URL




const emptySummary = {
  totalProjects: 0,
  totalSkills: 0,
  unreadMessages: 0,
  totalClients: 0,
  skillsDistribution: [],
  recentProjectsCreated: [],
  recentProjectsUpdated: [],
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewBy, setViewBy] = useState("updated");
  

  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const { data } = await axios.get(
          `${BASE_URL}/admin/dashboard/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setSummary({
          ...emptySummary,
          ...data.data,
          skillsDistribution: data.data?.skillsDistribution || [],
          recentProjectsCreated: data.data?.recentProjectsCreated || [],
          recentProjectsUpdated: data.data?.recentProjectsUpdated || [],
        });
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/admin/login");
        } else {
          setError(err.response?.data?.message || "Unable to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  // Derived data
  const recentList = viewBy === "created" 
    ? summary.recentProjectsCreated 
    : summary.recentProjectsUpdated;
    
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {error}
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Stats cards data
  const stats = [
    {
      label: "Projects",
      value: summary.totalProjects,
      icon: <FiFolder className="text-indigo-600" />,
      color: "bg-indigo-100"
    },
    {
      label: "Skills",
      value: summary.totalSkills,
      icon: <FiAward className="text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      label: "Clients",
      value: summary.totalClients,
      icon: <FiUsers className="text-green-600" />,
      color: "bg-green-100"
    },
    {
      label: "Messages",
      value: summary.unreadMessages,
      icon: <FiMail className="text-red-600" />,
      color: "bg-red-100"
    },
  ];

  // Navigation functions
  const goToProjects = () => navigate("/admin/dashboard/projects");
  const goToNewProject = () => navigate("/admin/dashboard/projects/new");
  const goToProject = (id) => navigate(`/admin/dashboard/projects/${id}`);
  const goToSkills = () => navigate("/admin/dashboard/skills");
  const goToMessages = () => navigate("/admin/dashboard/messages");
  const goToSettings = () => navigate("/admin/dashboard/settings/profile");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your portfolio
          </p>
        </div>
        <Button
          className="flex items-center gap-2 w-full sm:w-auto justify-center mt-2 sm:mt-0"
          onClick={goToNewProject}
        >
          <FiPlusCircle className="text-lg" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${color} p-3 rounded-full flex items-center justify-center`}>
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                  <p className="text-gray-600 text-sm mt-1">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <FiFolder className="text-indigo-600 text-xl" />
                <h2 className="font-semibold text-lg">Recent Projects</h2>
                <div className="hidden sm:flex border border-gray-200 rounded-md overflow-hidden">
                  <button
                    className={`px-3 py-1 text-xs flex items-center ${
                      viewBy === "updated"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                    onClick={() => setViewBy("updated")}
                  >
                    <FiClock className="mr-1" /> Updated
                  </button>
                  <button
                    className={`px-3 py-1 text-xs flex items-center ${
                      viewBy === "created"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                    onClick={() => setViewBy("created")}
                  >
                    <FiCalendar className="mr-1" /> Created
                  </button>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={goToProjects}
                className="hidden sm:flex items-center gap-1 text-indigo-600 hover:bg-indigo-50"
              >
                View all <FiChevronRight />
              </Button>
            </div>

            {recentList?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiFolder className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="font-medium">No projects created yet</p>
                <Button
                  className="mt-4"
                  onClick={goToNewProject}
                >
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left">Project</th>
                        <th className="px-4 py-3 text-left hidden sm:table-cell">Technologies</th>
                        <th className="px-4 py-3 text-left">
                          {viewBy === "created" ? "Created" : "Updated"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentList.slice(0, 6).map((p) => (
                        <tr 
                          key={p._id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => goToProject(p._id)}
                        >
                          <td className="px-4 py-3 font-medium">
                            <div className="flex items-center">
                              {/* Fixed image display */}
                              {p.image || p.coverImage ? (
                                <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                                  <img 
                                    src={p.image || p.coverImage} 
                                    alt={p.title} 
                                    className="w-full h-full rounded-xl object-cover border border-gray-200"
                                  />
                                  {!p.published && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">Draft</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-xl w-12 h-12 mr-3 flex-shrink-0 flex items-center justify-center">
                                  <FiFolder className="text-indigo-600" />
                                </div>
                              )}
                              <span className="truncate max-w-[120px] sm:max-w-[200px]">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {p.techStack?.slice(0, 3).map((tech) => (
                                <span 
                                  key={tech} 
                                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded whitespace-nowrap"
                                >
                                  {tech}
                                </span>
                              ))}
                              {p.techStack?.length > 3 && (
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  +{p.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {new Date(
                              viewBy === "created" ? p.createdAt : p.updatedAt
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="sm:hidden p-4 flex justify-end border-t">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={goToProjects}
                    className="text-indigo-600 hover:bg-indigo-50 flex items-center gap-1"
                  >
                    View all projects <FiChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills List */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <FiAward className="text-indigo-600 text-xl" />
                <h2 className="font-semibold text-lg">Skills</h2>
              </div>
              <Button 
                size="sm"
                variant="ghost"
                onClick={goToSkills}
                className="hidden sm:flex text-indigo-600 hover:bg-indigo-50"
              >
                Manage
              </Button>
            </div>
            
            {summary.skillsDistribution?.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-gray-500 p-6">
                <FiAward className="text-4xl text-gray-300 mb-3" />
                <p className="font-medium mb-4">No skills added yet</p>
                <Button
                  onClick={goToSkills}
                >
                  Add Skills
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-0">
                  {summary.skillsDistribution.slice(0, 6).map((skill) => (
                    <div 
                      key={skill.name} 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t cursor-pointer"
                      onClick={goToSkills}
                    >
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <FiAward className="text-indigo-600" />
                      </div>
                      <span className="font-medium truncate">{skill.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="sm:hidden p-4 flex justify-end border-t">
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={goToSkills}
                    className="text-indigo-600 hover:bg-indigo-50 flex items-center gap-1"
                  >
                    View all skills <FiChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center sm:justify-start gap-4 sm:gap-3 mt-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer"
          onClick={goToMessages}
        >
          <div className="bg-indigo-100 rounded-full p-3 flex items-center justify-center w-14 h-14 sm:w-auto sm:h-auto sm:hidden">
            <FiMessageSquare className="text-indigo-700 text-xl" />
            {summary.unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {summary.unreadMessages > 9 ? "9+" : summary.unreadMessages}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 px-4 py-2"
          >
            <FiMessageSquare className="text-indigo-600" /> 
            <span>Messages</span>
            {summary.unreadMessages > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {summary.unreadMessages > 9 ? "9+" : summary.unreadMessages}
              </span>
            )}
          </Button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={goToSkills}
        >
          <div className="bg-indigo-100 rounded-full p-3 flex items-center justify-center w-14 h-14 sm:w-auto sm:h-auto sm:hidden">
            <FiAward className="text-indigo-700 text-xl" />
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 px-4 py-2"
          >
            <FiAward className="text-indigo-600" /> Skills
          </Button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={goToSettings}
        >
          <div className="bg-indigo-100 rounded-full p-3 flex items-center justify-center w-14 h-14 sm:w-auto sm:h-auto sm:hidden">
            <FiUsers className="text-indigo-700 text-xl" />
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 px-4 py-2"
          >
            <FiUsers className="text-indigo-600" /> Settings
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;