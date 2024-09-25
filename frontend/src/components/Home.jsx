import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaDumbbell,
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaBolt,
} from "react-icons/fa";
import axios from "axios";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exerciseOfTheDay, setExerciseOfTheDay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchExerciseOfTheDay();
    }
  }, []);

  const fetchExerciseOfTheDay = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exercise-of-the-day/today/",
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setExerciseOfTheDay(response.data);
    } catch (error) {
      console.error("Error fetching exercise of the day:", error);
    }
  };

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

  const features = [
    {
      icon: <FaChartLine className="text-4xl text-blue-400" />,
      title: "Track Progress",
      description:
        "Monitor your fitness journey with detailed analytics and insights",
      link: "/progress",
    },
    {
      icon: <FaDumbbell className="text-4xl text-green-400" />,
      title: "Custom Workouts",
      description:
        "Create and manage personalized routines tailored to your goals",
      link: "/routines",
    },
    {
      icon: <FaTrophy className="text-4xl text-yellow-400" />,
      title: "Set Goals",
      description:
        "Define and achieve your fitness milestones with smart goal tracking",
      link: "/goals",
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-red-400" />,
      title: "Schedule Workouts",
      description: "Plan your exercise routine with an interactive calendar",
      link: "/schedule",
    },
    {
      icon: <FaUsers className="text-4xl text-purple-400" />,
      title: "Community Challenges",
      description: "Join fitness challenges and compete with friends",
      link: "/challenges",
    },
    {
      icon: <FaBolt className="text-4xl text-orange-400" />,
      title: "Quick Workouts",
      description:
        "Access a library of quick, effective workouts for busy days",
      link: "/quick-workouts",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12"
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

      {isLoggedIn && exerciseOfTheDay && (
        <motion.div
          className="mt-12 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl max-w-md w-full"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            Exercise of the Day
          </h3>
          {exerciseOfTheDay.exercise ? (
            <>
              <p className="text-blue-200 mb-2">
                {exerciseOfTheDay.exercise.name}
              </p>
              <p className="text-sm text-blue-300">
                {exerciseOfTheDay.exercise.description}
              </p>
            </>
          ) : (
            <p className="text-blue-200">No exercise available for today.</p>
          )}
        </motion.div>
      )}

      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(feature.link)}
          >
            <motion.div
              className="mb-4"
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

      <motion.div className="mt-16 text-center" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-white mb-4">
          Why Choose Exercise Tracker?
        </h2>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Exercise Tracker is more than just a routine tracker. It's your
          personal fitness companion, designed to help you achieve your goals,
          stay motivated, and make your fitness journey enjoyable and rewarding.
        </p>
      </motion.div>

        {/* <motion.div
          className="mt-12 flex flex-wrap justify-center gap-8"
          variants={containerVariants}
        >
          {[
            { number: "1M+", label: "Active Users" },
            { number: "10K+", label: "Workouts Completed" },
            { number: "95%", label: "User Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariants}
            >
              <p className="text-4xl font-bold text-white">{stat.number}</p>
              <p className="text-blue-200">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div> */}
    </motion.div>
  );
}

export default Home;
