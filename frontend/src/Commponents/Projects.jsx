/* ------------------------------------------------------------------ */
/*  Projects.jsx                                                      */
/* ------------------------------------------------------------------ */
import {
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiExternalLink,
  FiX,
  FiFilter,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { FaSort } from "react-icons/fa";

// Fallback image if a project has no image URL
import PlaceholderImg from "../assets/moorapank.jpg";

const Projects = () => {
  /* ───────────────────────────────
   *  State
   * ─────────────────────────────── */
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const [filter, setFilter]             = useState("All");
  const [sortOption, setSortOption]     = useState("Most Recent");

  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [showSortOptions, setShowSortOptions]         = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  /* ───────────────────────────────
   *  Fetch projects on first render
   * ─────────────────────────────── */
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: res } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/projects`
      );
  
      /* 1 pull list, default to [] */
      const raw = res?.data?.projects ?? [];
      console.log(raw)

      /* 2 convert tech objects → strings, ensure category is a string */
      const cleaned = raw.map((p) => ({
        ...p,
        category:
          typeof p.category === "object" ? p.category.name : p.category,
        technologies: (p.technologies || []).map((t) =>
          typeof t === "string" ? t : t.name
        ),
      }));

      setProjects(cleaned);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);





  /* ───────────────────────────────
   *  Derived data
   * ─────────────────────────────── */
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects]
  );

  const sortedProjects = useMemo(() => {
    /* 1. filter by category */
    const filtered =
      filter === "All"
        ? [...projects]
        : projects.filter((p) => p.category === filter);

    /* 2. sort */
    switch (sortOption) {
      case "Alphabetical (A-Z)":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case "Alphabetical (Z-A)":
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      case "Date (Newest)":
        return filtered.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      case "Date (Oldest)":
        return filtered.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      case "Most Recent":
      default:
        return filtered;
    }
  }, [filter, sortOption, projects]);

  /* ───────────────────────────────
   *  UI
   * ─────────────────────────────── */
  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-indigo-400">Projects</span>
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <p className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg">
            Here are a few highlighted projects showcasing my work.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FiFilter className="text-indigo-400 text-sm" />
                <span className="font-medium text-gray-200 text-sm">
                  Category:
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setShowCategoryFilters(!showCategoryFilters)
                  }
                  className="flex items-center justify-between text-white gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full text-sm"
                >
                  <span className="truncate">{filter}</span>
                  <FiChevronDown
                    className={`transition-transform ${
                      showCategoryFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showCategoryFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilter(cat);
                            setShowCategoryFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-sm ${
                            filter === cat
                              ? "text-indigo-400 font-medium"
                              : "text-gray-300"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaSort className="text-indigo-400 text-sm" />
                <span className="font-medium text-gray-200 text-sm">
                  Sort by:
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex items-center justify-between text-white gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full text-sm"
                >
                  <span className="truncate">{sortOption}</span>
                  <FiChevronDown
                    className={`transition-transform ${
                      showSortOptions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showSortOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20"
                    >
                      {[
                        "Most Recent",
                        "Alphabetical (A-Z)",
                        "Alphabetical (Z-A)",
                        "Date (Newest)",
                        "Date (Oldest)",
                      ].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortOption(opt);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-sm ${
                            sortOption === opt
                              ? "text-indigo-400 font-medium"
                              : "text-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading projects…</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sortedProjects.length === 0 ? (
          <p className="text-center text-gray-400">
            No projects match this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-700"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={PlaceholderImg}
                      alt="Placeholder"
                      className="w-full h-full object-cover opacity-40"
                    />
                  )}

                  {/* Overlay & label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 z-10 text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <span className="absolute top-4 right-4 bg-indigo-600 text-xs text-white px-2.5 py-1 rounded-full z-10">
                    {project.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-indigo-900/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors"
                    >
                      <FiGithub />
                      Code
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors"
                    >
                      <FiExternalLink />
                      Demo
                    </a>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 z-10"
              >
                <FiX className="text-gray-200" size={24} />
              </button>

              {/* Image */}
              <div className="relative h-72 md:h-80 overflow-hidden">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={PlaceholderImg}
                    alt="Placeholder"
                    className="w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                  <span className="inline-block mt-2 bg-indigo-600 text-xs text-white px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 md:p-8">
                <p className="text-gray-300 mb-6 text-lg">
                  {selectedProject.description}
                </p>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    <FiGithub className="text-xl" />
                    Source Code
                  </a>
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
                  >
                    <FiExternalLink className="text-xl" />
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
