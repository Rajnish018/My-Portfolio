import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiCopy,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";

const Contact = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("+91 91426 79149");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await axios.post("http://localhost:8000/api/v1/public/contacts", {
      ...formData,                    // name, email, message
      subject: "Portfolio Feedback",
    });

    setSubmitStatus("success");       // show green banner
    setFormData({ name: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    setSubmitStatus("error");         // show red banner
  }
  finally {
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 800);
  }
  console.log("Form submitted:", formData);

};

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-950"
    >
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
            Get In <span className="text-indigo-400">Touch</span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <p className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg">
            Have a project in mind or want to collaborate? Feel free to reach
            out!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-2/5"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <FiMapPin className="text-indigo-400" size={24} />
                </div>
                Contact Information
              </h3>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiMail className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200 mb-1">
                      Email
                    </h4>
                    <a
                      href="mailto:rajnish.kumar018001@gamil.com"
                      className="text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                    >
                      rajnish.kumar018001@gamil.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiMapPin className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200 mb-1">
                      Location
                    </h4>
                    <p className="text-indigo-300">Ahmedabad, Gujarat</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiPhone className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200 mb-1">
                      Phone
                    </h4>
                    <div className="flex items-center">
                      <a
                        href="tel:9142679149"
                        className="text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                      >
                        <span className="mr-2">🇮🇳</span> +91 91426 79149
                      </a>

                      <div className="ml-3 relative">
                        <button
                          onClick={handleCopy}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                          title="Copy number"
                        >
                          {copied ? (
                            <FiCheck size={18} className="text-green-400" />
                          ) : (
                            <FiCopy size={18} />
                          )}
                        </button>
                        {copied && (
                          <span className="absolute -top-6 -left-2 bg-gray-700 text-xs text-green-400 px-2 py-1 rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-xl font-semibold text-gray-200 mb-6">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://linkedin.com/in/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-indigo-600 p-3 rounded-full transition-all duration-300 cursor-pointer"
                    aria-label="LinkedIn"
                    whileHover={{ y: -5 }}
                  >
                    <FiLinkedin size={20} className="text-gray-300" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-indigo-600 p-3 rounded-full transition-all duration-300 cursor-pointer"
                    aria-label="GitHub"
                    whileHover={{ y: -5 }}
                  >
                    <FiGithub size={20} className="text-gray-300" />
                  </motion.a>
                  <motion.a
                    href="https://twitter.com/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-indigo-600 p-3 rounded-full transition-all duration-300 cursor-pointer"
                    aria-label="Twitter"
                    whileHover={{ y: -5 }}
                  >
                    <FaXTwitter size={20} className="text-gray-300" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-3/5"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <FiSend className="text-indigo-400" size={24} />
                </div>
                Send Me a Message
              </h3>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2 cursor-pointer"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all cursor-text"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2 cursor-pointer"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all cursor-text"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2 cursor-pointer"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all cursor-text"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ name: "", email: "", message: "" })
                    }
                    className="px-10 py-3 bg-gradient-to-r from-gray-700 to-gray-600 
  hover:from-gray-600 hover:to-gray-500 rounded-lg font-medium text-lg 
  transition-all duration-300 shadow-lg hover:shadow-gray-500/20 flex 
  items-center justify-center text-gray-200 cursor-pointer"
                  >
                    Clear Form
                  </button>
                </div>

                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg mt-4"
                    >
                      <div className="flex items-center">
                        <FiCheck className="mr-2 text-green-400" />
                        Message sent successfully! I'll get back to you soon.
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg mt-4"
                    >
                      Oops! Something went wrong. Please try again later.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements matching other sections */}
      <div className="absolute left-10 top-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute right-20 top-2/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Contact;