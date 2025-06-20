import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

const colors = [
  "indigo", "blue", "green", "rose", "purple", "amber", "gray",
];

export default function Appearance() {
  const [theme, setTheme]     = useState("light");         // light | dark
  const [color, setColor]     = useState("indigo");        // tailwind color keyword

  /* read from localStorage on mount */
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")  ?? "light";
    const storedCol   = localStorage.getItem("color")  ?? "indigo";
    setTheme(storedTheme);
    setColor(storedCol);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    document.documentElement.style.setProperty("--tw-prose-links",`var(--tw-${storedCol}-600)`);
  }, []);

  const savePrefs = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("color", color);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.setProperty("--tw-prose-links",`var(--tw-${color}-600)`);
  };

  return (
    <motion.div
      className="p-6 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Appearance</h1>

      {/* Theme toggle */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Theme</h2>
        <div className="flex items-center gap-4">
          {["light", "dark"].map((opt) => (
            <button
              key={opt}
              onClick={() => setTheme(opt)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                theme === opt ? "bg-indigo-600 text-white" : "border-gray-300"
              }`}
            >
              {opt === "light" ? <FiSun /> : <FiMoon />}
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Primary color picker */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Primary Color</h2>
        <div className="grid grid-cols-7 gap-3">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-full bg-${c}-600 ${
                color === c ? "ring-2 ring-offset-2 ring-indigo-500" : ""
              }`}
              title={c}
            />
          ))}
        </div>
      </div>

      <button
        onClick={savePrefs}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Save Preferences
      </button>
    </motion.div>
  );
}
