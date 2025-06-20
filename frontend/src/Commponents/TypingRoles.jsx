import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const TypingRoles = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 }); // Full Stack
      await new Promise(resolve => setTimeout(resolve, 800));
      await controls.start({ opacity: 1, y: 0 }); // Machine Learning
      await new Promise(resolve => setTimeout(resolve, 800));
      await controls.start({ opacity: 1, y: 0 }); // UI/UX
    };
    sequence();
  }, [controls]);

  return (
    <div className="mb-8 space-y-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={controls}
        className="flex items-center justify-center gap-2"
      >
        <FiCode className="text-indigo-300 text-xl" />
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-200">
          Full Stack Developer
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={controls}
        className="flex items-center justify-center gap-2"
      >
        <FiCpu className="text-purple-300 text-xl" />
        <h2 className="text-xl md:text-2xl font-medium text-purple-200">
          Machine Learning Engineer
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={controls}
        className="flex items-center justify-center gap-2"
      >
        <FiLayers className="text-pink-300 text-xl" />
        <h2 className="text-xl md:text-2xl font-medium text-pink-200">
          UI/UX Designer
        </h2>
      </motion.div>
    </div>
  );
};

export default TypingRoles