// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context.jsx";
import axios from "axios";
import {
  FiLayout,
  FiFolder,
  FiAward,
  FiMail,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiHelpCircle,
  FiChevronDown,
  FiChevronRight as SubChevron,
  FiBook,
  FiFileText,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const [adminInfo, setAdminInfo] = useState({ name: "", email: "" });
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Load admin profile
  useEffect(() => {
    const fetchProfile = async () => {


      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/public/profile"
        );
        setAdminInfo(data.data);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
        localStorage.removeItem("adminToken");
        setAdminInfo({ name: "", email: "" });
      }
    };

    fetchProfile();
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log(token)
        const res = await axios.get(
          "http://localhost:8000/api/v1/admin/messages/unread-count",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(res)
        setUnreadCount(res.data?.data?.unreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch message count:", err);
      }
    };
    fetchCount();
  }, [location.pathname]);

  // Determine active submenu from URL
  useEffect(() => {
    for (const item of navItemsTemplate) {
      if (item.submenu) {
        const sub = item.submenu.find((s) => location.pathname === s.path);
        if (sub) return setActiveSubmenu(item.text);
      }
    }
    setActiveSubmenu(null);
  }, [location.pathname]);

  const navItemsTemplate = [
    { icon: <FiLayout />, text: "Dashboard", path: "/admin/dashboard" },
    {
      icon: <FiBook />,
      text: "Education",
      path: "/admin/dashboard/education",
    },
    {
      icon: <FiFileText />,
      text: "Certifications",
      path: "/admin/dashboard/certifications",
    },
    {
      icon: <FiFolder />,
      text: "Projects",
      submenu: [
        { text: "All Projects", path: "/admin/dashboard/projects" },
        { text: "Featured", path: "/admin/dashboard/projects/featured" },
        { text: "Archived", path: "/admin/dashboard/projects/archived" },
      ],
    },
    { icon: <FiAward />, text: "Skills", path: "/admin/dashboard/skills" },
    {
      icon: <FiMail />,
      text: "Messages",
      path: "/admin/dashboard/messages",
      badge: unreadCount,
    },
    {
      icon: <FiSettings />,
      text: "Settings",
      submenu: [
        { text: "Profile", path: "/admin/dashboard/settings/profile" },
        { text: "Account", path: "/admin/dashboard/settings/account" },
      ],
    },
  ];

  const toggleCollapse = () => {
    setCollapsed((c) => !c);
    setActiveSubmenu(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
    setActiveSubmenu(null);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const SidebarNavLink = ({ item }) => {
    const isActive =
      location.pathname === item.path ||
      !!item.submenu?.find((s) => location.pathname === s.path);

    const handleClick = () => {
      if (item.submenu) {
        toggleSubmenu(item.text);
      } else {
        if (isMobile) setIsMobileOpen(false);
      }
    };

    return (
      <NavLink
        to={item.path || "#"}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
        } ${collapsed && !isMobile ? "justify-center" : ""}`}
        onClick={handleClick}
      >
        <span className={`${collapsed && !isMobile ? "" : "mr-3"}`}>
          {item.icon}
        </span>

        {(!collapsed || isMobile) && (
          <span className="flex-1 flex items-center justify-between">
            {item.text}
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
            {item.submenu && (
              <span className="ml-2">
                {activeSubmenu === item.text ? (
                  <FiChevronDown />
                ) : (
                  <SubChevron />
                )}
              </span>
            )}
          </span>
        )}
      </NavLink>
    );
  };

  const toggleSubmenu = (text) =>
    setActiveSubmenu((prev) => (prev === text ? null : text));

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    if (isMobile) {
      setIsMobileOpen(false);
      setShowProfileDropdown(false);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 z-50 flex items-center justify-between px-4">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 rounded-lg"
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
          
          <div className="flex items-center">
            <div className="bg-white w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-indigo-700 font-bold">R</span>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center text-sm rounded-full focus:outline-none"
            >
              {adminInfo.avatar ? (
                <img
                  src={adminInfo.avatar}
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center">
                  <FiUser className="text-indigo-800" />
                </div>
              )}
            </button>
            
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <NavLink
                    to="/admin/dashboard/settings/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/admin/dashboard/settings/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-16 left-0 right-0 bg-gradient-to-b from-purple-500 to-indigo-600 z-40 overflow-hidden"
          >
            <nav className="py-4 px-2 space-y-1">
              {navItemsTemplate
                .filter(item => item.text !== "Settings")
                .map((item) => (
                  <div key={item.text} className="mb-1">
                    <SidebarNavLink item={item} />
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === item.text && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-1 ml-8 space-y-1"
                        >
                          {item.submenu.map((sub) => {
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <NavLink
                                key={sub.text}
                                to={sub.path}
                                className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                                  isSubActive
                                    ? "bg-indigo-900 text-white"
                                    : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
                                }`}
                                onClick={() => setIsMobileOpen(false)}
                              >
                                {sub.text}
                                {isSubActive && (
                                  <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                )}
                              </NavLink>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-sm text-indigo-100 hover:bg-indigo-600 rounded-md"
              >
                <FiHelpCircle className="mr-3" /> Help & Support
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed inset-y-0 left-0 z-30 ${collapsed ? "w-20" : "w-64"} transition-all duration-300`}>
        <div className="bg-gradient-to-b from-purple-500 to-indigo-600 flex flex-col h-full">
          <div className={`flex items-center justify-between p-6 ${collapsed ? "px-0" : ""}`}>
            {!collapsed && (
              <div className="flex items-center">
                <div className="bg-white w-8 h-8 rounded-md mr-3 flex items-center justify-center">
                  <span className="text-indigo-700 font-bold">R</span>
                </div>
                <span className="text-white text-xl font-bold">
                  Admin Panel
                </span>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="text-indigo-100 hover:bg-indigo-600 rounded-full p-2"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {/* Admin Info */}
          <div
            className={`flex items-center px-4 py-3 border-b border-indigo-600 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {adminInfo.avatar ? (
              <img
                src={adminInfo.avatar}
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                <FiUser className="text-indigo-800" />
              </div>
            )}
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {adminInfo.name || "Admin Name"}
                </p>
                <p className="text-xs text-indigo-100">
                  {adminInfo.email || "admin@portfolio.com"}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
            {navItemsTemplate.map((item) => (
              <div key={item.text} className="mb-1">
                <SidebarNavLink item={item} />
                <AnimatePresence>
                  {item.submenu && !collapsed && activeSubmenu === item.text && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-1 ml-8 space-y-1"
                    >
                      {item.submenu.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <NavLink
                            key={sub.text}
                            to={sub.path}
                            className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                              isSubActive
                                ? "bg-indigo-900 text-white"
                                : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
                            }`}
                          >
                            {sub.text}
                            {isSubActive && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-400"></span>
                            )}
                          </NavLink>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-indigo-600">
            {!collapsed && (
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-600 rounded-md mb-2"
              >
                <FiHelpCircle className="mr-3" /> Help & Support
              </a>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 rounded-md ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <FiLogOut className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;