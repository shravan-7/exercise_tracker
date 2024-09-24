import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

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
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="max-w-4xl w-full space-y-8 text-center"
        variants={itemVariants}
      >
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold text-white mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Exercise Tracker
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-blue-200 mb-12"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Elevate Your Fitness Journey
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          variants={itemVariants}
        >
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 shadow-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:-rotate-1 shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        variants={containerVariants}
      >
        {[
          {
            icon: "📊",
            title: "Track Progress",
            description: "Monitor your fitness journey with detailed analytics",
            link: "/progress",
          },
          {
            icon: "🏋️‍♂️",
            title: "Custom Workouts",
            description: "Create personalized routines tailored to your goals",
            link: "/create-routine",
          },
          {
            icon: "🏆",
            title: "Set Goals",
            description: "Define and achieve your fitness milestones",
            link: "/goals",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(feature.link)}
          >
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-blue-200">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Home;
