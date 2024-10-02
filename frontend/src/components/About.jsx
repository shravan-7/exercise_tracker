import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
        variants={itemVariants}
      >
        <div className="md:flex">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col justify-center items-center text-white">
            <motion.img
              src="/favicon.ico"
              alt="Exercise Tracker Logo"
              className="w-32 h-32 mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <h1 className="text-3xl font-bold mb-4">Exercise Tracker</h1>
            <p className="text-center mb-6">Your personal fitness companion</p>
            <div className="flex space-x-4">
              <SocialIcon Icon={FaGithub} href="https://github.com/" />
              <SocialIcon Icon={FaLinkedin} href="#" />
              <SocialIcon
                Icon={FaEnvelope}
                href="mailto:contact@exercisetracker.com"
              />
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">About Us</h2>
            <p className="text-blue-600 mb-4">
              Exercise Tracker is a full-stack web application designed to help
              users track their workout routines, monitor progress, and maintain
              a consistent fitness regimen.
            </p>
            <p className="text-blue-600 mb-4">
              Built with React for the frontend and Django for the backend, our
              application offers a seamless user experience for creating,
              managing, and analyzing workout routines.
            </p>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Our Mission
            </h3>
            <p className="text-blue-600 mb-4">
              To empower individuals in their fitness journey by providing an
              intuitive and comprehensive tool for tracking and improving their
              exercise habits.
            </p>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "Django",
                "Python",
                "JavaScript",
                "HTML5",
                "CSS3",
                "Redis",
                "Celery",
              ].map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SocialIcon = ({ Icon, href }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors duration-300"
  >
    <Icon size={20} />
  </motion.a>
);

export default About;
