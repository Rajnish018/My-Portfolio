import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiCode,
  FiDatabase,
  FiCpu,
  FiLayers,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import axios from "axios";

// Icon mapping
const iconMap = {
  FiCode,
  FiDatabase,
  FiCpu,
  FiLayers,
  FiBookOpen,
  FiAward,
};

// ============================== Typewriter Component ==============================
const TypewriterParagraphs = ({ start }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "I'm a passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in creating responsive, accessible interfaces with React and Next.js, backed by scalable Node.js and Python services. My approach combines technical excellence with user-centered design to deliver exceptional digital experiences.";

  useEffect(() => {
    if (!start) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [start]);

  return (
    <div className="space-y-4">
      <p className="text-gray-300 leading-relaxed text-lg">
        {displayText}
        {start && (
          <span className="inline-block w-2 h-6 bg-indigo-500 animate-pulse align-middle ml-1"></span>
        )}
      </p>
      <p className="text-gray-400 leading-relaxed">
        When I'm not coding, you'll find me contributing to open-source
        projects, exploring new technologies, or hiking in the mountains. I
        believe in continuous learning and pushing the boundaries of what's
        possible on the web.
      </p>
    </div>
  );
};

// ============================== About Section ==============================
const About = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [typewriterStarted, setTypewriterStarted] = useState(false);
  const aboutRef = useRef(null);
  const isInView = typeof window !== "undefined" ? useInView(aboutRef, { once: true, amount: 0.1 }) : false;

  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
           `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/skills`
        );

        console.log("response from fetch skill",res)

        const skillsRaw = res.data?.data?.skills || [];

        const processed = skillsRaw.map((s) => {
          const IconComponent = iconMap[s.icon] || FiCode;
          return {
            id: s._id,
            name: s.name,
            color: s.color,
            icon: <IconComponent size={24} />,
            items: (s.items || []).map((it) => it.name),
          };
        });

        setSkills(processed);
        setError(null);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Start typewriter when section comes into view
  useEffect(() => {
    if (isInView && !typewriterStarted) {
      setTypewriterStarted(true);
    }
  }, [isInView, typewriterStarted]);

  // Fetch education data
  useEffect(() => {
    const fetchEducation = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
           `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/education `
        );
        const educationRaw = res.data?.data ?? [];

        console.log("Fetched education data:", educationRaw);

        const processed = educationRaw.map((edu) => ({
          degree: edu.degree || "Unknown Degree",
          institution: edu.institution || "Unknown Institution",
          year: edu.year || "Unknown Year",
          achievements: edu.achievements || [],
        }));
        setEducation(processed);
        setError(null);
      } catch (error) {
        console.error("Error fetching education:", error);
        setError("Failed to load education data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  // Fetch certifications data

  useEffect(() => {
    const fetchCertifications = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/certifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const certificationsRaw = res.data?.data ?? [];
        const processed = certificationsRaw.map((cert) => ({
          name: cert.name || "Unknown Certification",
          issuer: cert.issurer || "Unknown Issuer",
          year: cert.year || "Unknown Year",
        }));
        setCertifications(processed);
        setError(null);
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setError("Failed to load certifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  {
    /* const education = [
    {
      degree: "B.Sc Computer Science",
      institution: "Tech University",
      year: "2020-2024",
      achievements: [
        "Graduated with honors",
        "Senior Project Award",
        "Dean's List 3 years",
      ],
    },
    {
      degree: "Web Development Bootcamp",
      institution: "Code Academy",
      year: "2019",
      achievements: ["Top 5% of cohort", "Capstone Project Excellence"],
    },
  ];

  const certifications = [
    { name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
    { name: "Google UX Design Professional", issuer: "Google", year: "2022" },
    {
      name: "React Advanced Concepts",
      issuer: "Frontend Masters",
      year: "2021",
    },
  ];
*/
  }
  return (
    <section id="about" className="py-20 relative" ref={aboutRef}>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About <span className="text-indigo-500">Me</span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          ></motion.div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="mb-3 text-red-600 font-medium">Error:</p>
            <pre className="bg-red-50 p-3 rounded-md text-sm text-red-700">
              {error}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <FiBookOpen className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-2xl font-semibold text-white">Who I Am</h3>
              </div>

              <TypewriterParagraphs start={typewriterStarted} />

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                  <div className="text-indigo-400 font-semibold">5+ Years</div>
                  <div className="text-gray-400 text-sm">Experience</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                  <div className="text-indigo-400 font-semibold">
                    30+ Projects
                  </div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="flex border-b border-gray-800 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                    activeTab === "skills"
                      ? "text-white bg-gray-800 border-t border-l border-r border-gray-700"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("skills")}
                >
                  Skills
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                    activeTab === "education"
                      ? "text-white bg-gray-800 border-t border-l border-r border-gray-700"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("education")}
                >
                  Education
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                    activeTab === "certifications"
                      ? "text-white bg-gray-800 border-t border-l border-r border-gray-700"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("certifications")}
                >
                  Certifications
                </button>
              </div>

              {activeTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm border border-gray-700 text-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-lg ${skill.color} mr-3`}>
                          {skill.icon}
                        </div>
                        <h4 className="text-lg font-medium">{skill.name}</h4>
                      </div>
                      <ul className="space-y-2">
                        {skill.items.map((item) => (
                          <li
                            key={item}
                            className="text-gray-300 flex items-center text-sm"
                          >
                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-5">
                  {education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-white">
                              {edu.degree}
                            </h4>
                            <p className="text-indigo-400">{edu.institution}</p>
                          </div>
                          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
                            {edu.year}
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm text-gray-400 font-medium mb-2">
                            Achievements:
                          </div>
                          <ul className="space-y-1">
                            {edu.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className="flex items-center text-sm text-gray-300"
                              >
                                <FiAward
                                  className="text-yellow-400 mr-2"
                                  size={16}
                                />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "certifications" && (
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl p-5 flex items-start"
                    >
                      <div className="bg-indigo-500/20 p-2 rounded-lg mr-4">
                        <FiAward className="text-indigo-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{cert.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-400">
                            {cert.issuer}
                          </span>
                          <span className="text-sm text-indigo-300">
                            {cert.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute left-10 top-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute right-20 top-2/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default About;
