import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import { useAuth } from "./context/auth.context.jsx"; // Import the auth context

/* ───────── Portfolio imports (eager) ───────── */
import Navbar from "./Commponents/Navbar.jsx";
import Hero from "./Commponents/Hero.jsx";
import About from "./Commponents/About.jsx";
import Projects from "./Commponents/Projects.jsx";
import Contact from "./Commponents/Contact.jsx";
import Footer from "./Commponents/Footer.jsx";
import ScrollProgressBar from "./Commponents/ScrollProgressBar.jsx";
import EducationAdmin from "./Admin Panel/Pages/education.jsx";
import CertificationAdmin from "./Admin Panel/Pages/Certification.jsx";
import Profile from "./Admin Panel/Pages/settings/Profile.jsx";
import Account from "./Admin Panel/Pages/settings/Account.jsx";
import Appearance from "./Admin Panel/Pages/settings/Appearance.jsx";

/* ───────── Admin imports (lazy) ───────── */
const AdminLogin = lazy(() => import("./Admin Panel/Pages/Login.jsx"));
const DashboardLayout = lazy(() =>
  import("./Admin Panel/Pages/DashboardLayout.jsx")
);
const DashboardHome = lazy(() => import("./Admin Panel/Pages/Home.jsx"));
// const ProjectsAdmin = lazy(() => import("./Admin Panel/Pages/Project.jsx"));
const MessagesAdmin = lazy(() => import("./Admin Panel/Pages/Message.jsx"));
const SkillsAdmin = lazy(() => import("./Admin Panel/Pages/Skills.jsx"));
const NotFound = lazy(() => import("./Admin Panel/commpenets/NotFound.jsx")); // create this page
const AllProjects = lazy(() =>
  import("./Admin Panel/Pages/Projects/AllProject.jsx")
);
const FeaturedProjects = lazy(() =>
  import("./Admin Panel/Pages/Projects/FeaturedProjects.jsx")
);
const ArchivedProjects = lazy(() =>
  import("./Admin Panel/Pages/Projects/ArchivedProjects")
);

/* ───────── Portfolio wrapper ───────── */
const Portfolio = () => (
  <>
    <Navbar />
    <ScrollProgressBar />
    <Hero />
    <div className="bg-gradient-to-b from-gray-900 to-gray-950">
      <About />
      <Projects />
    </div>
    <Contact />
    <Footer />
  </>
);

/* ───────── Auth guard for admin ───────── */
const PrivateRoute = ({ children }) => {
  const authed = !!localStorage.getItem("adminToken");
  const { token } = useAuth();
  return authed ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  /* smooth scroll for hash links */
  useEffect(() => {
    const h = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href !== "#home" ? href : " ");
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <Router>
      {/* Suspense handles lazy components */}
      <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
        <Routes>
          {/* ───── Portfolio ───── */}
          <Route path="/" element={<Portfolio />} />

          {/* ───── Redirect /admin to /admin/login ───── */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />

          {/* ───── Admin login (public) ───── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ───── Admin dashboard (protected) ───── */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            {/* <Route path="projects" element={<ProjectsAdmin />} />  */}
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />

            {/* ───── Projects sub-routes ───── */}
            <Route path="projects" element={<AllProjects />} />
            <Route path="projects/featured" element={<FeaturedProjects />} />
            <Route path="projects/archived" element={<ArchivedProjects />} />
            <Route path="education" element={<EducationAdmin />} />
            <Route path="certifications" element={<CertificationAdmin />} />
            {/* ───── Settings sub-routes ───── */}
            <Route path="settings/profile" element={<Profile />} />
            <Route path="settings/account" element={<Account />} />
            <Route path="settings/appearance" element={<Appearance />} />
          </Route>

          {/* ───── 404 fallback ───── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
