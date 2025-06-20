// src/pages/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Track mouse position for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };
    
    // Check for mobile devices
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random messages to display
  const messages = [
    "Houston, we have a problem...",
    "This page is in another dimension",
    "The content you seek has vanished",
    "This is not the page you're looking for",
    "Abandon all hope, ye who enter here",
    "Page not found, but you found us",
    "404: Digital wilderness ahead",
    "You've discovered a void in the internet"
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden relative">
      {/* Background particles */}
      <Particles
        className="absolute inset-0"
        params={{
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            color: { value: "#ffffff" },
            line_linked: {
              color: "#ffffff",
              opacity: 0.4,
              width: 1
            },
            move: {
              speed: 1.5
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              }
            }
          }
        }}
      />
      
      {/* Floating planets */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-yellow-300 to-orange-500 shadow-lg shadow-orange-500/50"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-blue-300 to-indigo-500 shadow-lg shadow-indigo-500/50"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -360]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-2/3 w-16 h-16 rounded-full bg-gradient-to-r from-pink-300 to-red-500 shadow-lg shadow-red-500/50"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, 180]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div 
          className="text-center max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            transform: isMobile ? 'none' : `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        >
          <motion.div variants={itemVariants}>
            <div className="relative inline-block">
              <motion.h1 
                className="text-9xl font-bold tracking-tighter"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                4
                <motion.span 
                  className="inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  0
                </motion.span>
                4
              </motion.h1>
              
              {/* Astronaut */}
              <motion.div 
                className="absolute top-0 -right-16"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="30" r="20" fill="#fff" />
                  <circle cx="45" cy="25" r="3" fill="#333" />
                  <circle cx="55" cy="25" r="3" fill="#333" />
                  <path d="M40 35 Q50 40 60 35" stroke="#333" strokeWidth="2" fill="none" />
                  <rect x="40" y="40" width="20" height="30" rx="5" fill="#fff" />
                  <rect x="35" y="45" width="5" height="20" rx="2" fill="#fff" />
                  <rect x="60" y="45" width="5" height="20" rx="2" fill="#fff" />
                  <rect x="45" y="70" width="5" height="15" rx="2" fill="#fff" />
                  <rect x="50" y="70" width="5" height="15" rx="2" fill="#fff" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mt-6 mb-4"
              animate={{ opacity: [0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {randomMessage}
            </motion.h2>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-indigo-100">
              The page you're looking for has been lost in space. Maybe it was never here, 
              or maybe it drifted away into the cosmic void. Don't worry, you can always 
              return to safety.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link to="/">
              <motion.button
                className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 ${
                  isHovering 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-110' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                animate={isHovering ? { rotate: [0, 5, -5, 0] } : {}}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Beam Me Home
                </span>
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-indigo-200 text-sm"
            variants={itemVariants}
          >
            <p>Error code: 404 | Lost in space since {new Date().getFullYear()}</p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating debris */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-${Math.floor(Math.random() * 4) + 2} h-${Math.floor(Math.random() * 4) + 2} bg-white/20 rounded-full`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 50 - 25, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default NotFound;