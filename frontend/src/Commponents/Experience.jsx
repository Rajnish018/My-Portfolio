import { motion } from 'framer-motion';
import { FiBriefcase, FiAward } from 'react-icons/fi';

const experiences = [
  {
    role: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    duration: '2022 - Present',
    responsibilities: [
      'Developed and maintained responsive web applications using React.js',
      'Collaborated with UX designers to implement pixel-perfect interfaces',
      'Optimized application performance, reducing load times by 40%',
      'Mentored junior developers and conducted code reviews'
    ]
  },
  {
    role: 'Web Development Intern',
    company: 'Digital Agency',
    duration: '2021 - 2022',
    responsibilities: [
      'Assisted in building client websites using JavaScript and WordPress',
      'Participated in agile development processes and sprint planning',
      'Fixed bugs and implemented new features based on client feedback',
      'Learned industry best practices for web development'
    ]
  }
];

const certifications = [
  {
    title: 'Advanced React',
    issuer: 'Udemy',
    year: '2023'
  },
  {
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    year: '2022'
  },
  {
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    year: '2021'
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 ">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience & Certifications</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiBriefcase className="mr-2 text-indigo-600" />
              Work Experience
            </h3>
            
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  <div className="absolute left-2 top-5 h-full w-0.5 bg-indigo-200"></div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h4 className="text-xl font-bold text-gray-800">{exp.role}</h4>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {exp.duration}
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {exp.responsibilities.map((item, i) => (
                        <li key={i} className="text-gray-600 flex">
                          <span className="w-1 h-1 bg-indigo-400 rounded-full mt-2 mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiAward className="mr-2 text-indigo-600" />
              Certifications
            </h3>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiAward className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{cert.title}</h4>
                      <p className="text-indigo-600 mb-1">{cert.issuer}</p>
                      <span className="text-gray-500 text-sm">{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Skills Overview</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Frontend Development</span>
                    <span className="text-gray-700">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Backend Development</span>
                    <span className="text-gray-700">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">UI/UX Design</span>
                    <span className="text-gray-700">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;