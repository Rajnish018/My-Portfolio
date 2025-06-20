import { motion } from 'framer-motion';
import { FiHeart,FiLinkedin,
FiGithub } from 'react-icons/fi';
import { FaXTwitter } from "react-icons/fa6";


const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center">
          {/*<div className="flex space-x-6 mb-6">
            <a 
              href="https://linkedin.com/in/username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://github.com/username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-6 h-6" />
            </a>
            <a 
              href="https://twitter.com/username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-6 h-6" />
            </a>
          </div>*/}
          
          <p className="text-gray-400 text-center mb-4">
            Made with <FiHeart className="inline text-red-500" /> by Rajnish Kumar
          </p>
          
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;