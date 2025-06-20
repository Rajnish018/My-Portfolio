// DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../commpenets/Sidebar.jsx";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Collapse sidebar by default on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        isMobile={isMobile} 
      />
      
      {/* Main content with responsive width */}
      <div 
        className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
          isMobile ? "pt-16" : ""
        }`}
        style={{
          marginLeft: !isMobile ? (collapsed ? "5rem" : "16rem") : "0",
          width: !isMobile ? (collapsed ? "calc(100% - 5rem)" : "calc(100% - 16rem)") : "100%",
        }}
      >
        <div className="px-4 py-6 md:px-8 md:py-10 w-full max-w-[1800px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;