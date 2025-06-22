import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiCode,
  FiCpu,
  FiLayers,
  FiDownload,
  FiArrowRight,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Hero = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [profileImage, setProfileImage] = useState("/assets/default-avatar.svg");
  const [userName, setUserName] = useState("Rajnish Kumar");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${BASE_URL}/public/profile`);
        const data = await res.json();
        setProfileImage(data?.data?.avatar || "/assets/default-avatar.svg");
        setUserName(data?.data?.name || "Rajnish Kumar");
      } catch (error) {
        console.error("Failed to fetch image:", error);
        setProfileImage("/assets/default-avatar.svg");
      }
    };

    fetchImage();
  }, []);

  const roles = [
    {
      title: "Full Stack Developer",
      icon: <FiCode className="text-indigo-300 text-xl md:text-2xl" />,
      color: "text-indigo-200",
    },
    {
      title: "Machine Learning Engineer",
      icon: <FiCpu className="text-purple-300 text-xl md:text-2xl" />,
      color: "text-purple-200",
    },
    {
      title: "UI/UX Designer",
      icon: <FiLayers className="text-pink-300 text-xl md:text-2xl" />,
      color: "text-pink-200",
    },
  ];

  useEffect(() => {
    const current = roles[currentRoleIndex].title;
    const speed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setCurrentText((prev) => prev + current.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setCharIndex(0);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentRoleIndex]);

  const currentRole = roles[currentRoleIndex];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white pt-20"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left max-w-2xl"
          >
            {/* Name */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold"
              whileHover={{ scale: 1.02 }}
            >
              Hi, I'm
              <span className="text-indigo-300"> {userName}</span>
            </motion.h1>

            {/* Typing Roles */}
            <div className="min-h-[100px] md:min-h-[140px] flex flex-col items-center md:items-start justify-center text-center md:text-left">
              <motion.div
                key={currentRoleIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 my-1"
              >
                {currentRole.icon}
                <h2 className={`text-lg sm:text-xl md:text-2xl font-medium ${currentRole.color}`}>
                  {currentText}
                  <span className="animate-pulse">|</span>
                </h2>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-base sm:text-lg md:text-xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              I craft exceptional digital experiences using cutting-edge
              technologies and design principles.
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <motion.a
                href="/resume.pdf"
                download="Rajnish_Kumar_Resume.pdf"
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <FiDownload className="mr-2" />
                Download Resume
              </motion.a>

              <motion.a
                href="#projects"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-indigo-400 hover:bg-indigo-400/10 rounded-lg font-medium text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                View My Work
                <FiArrowRight className="ml-2" />
              </motion.a>
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-indigo-300 shadow-xl shadow-indigo-500/30 mx-auto md:mx-0">
              <motion.img
                src={profileImage}
                alt="Rajnish Kumar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/default-avatar.svg";
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;