import React from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaDumbbell,
  FaChartLine,
  FaListUl,
  FaBell,
  FaMobileAlt,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: FaUserCircle,
      title: "User Authentication",
      description: "Secure registration, login, and profile management",
    },
    {
      icon: FaDumbbell,
      title: "Workout Management",
      description: "Create and manage personalized workout routines",
    },
    {
      icon: FaChartLine,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed analytics",
    },
    {
      icon: FaListUl,
      title: "Exercise Library",
      description:
        "Access a comprehensive library of exercises with categories",
    },
    {
      icon: FaBell,
      title: "Workout Reminders",
      description: "Set reminders to stay consistent with your fitness goals",
    },
    {
      icon: FaMobileAlt,
      title: "Responsive Design",
      description: "Seamless experience on both mobile and desktop devices",
    },
    {
      icon: FaTrophy,
      title: "Goal Setting",
      description:
        "Define and achieve your fitness milestones with smart goal tracking",
    },
    {
      icon: FaCalendarAlt,
      title: "Schedule Workouts",
      description: "Plan your exercise routine with an interactive calendar",
    },
  ];

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
      <motion.div className="max-w-6xl mx-auto" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
      }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200 hover:border-blue-400 transition-colors duration-300"
    >
      <div className="p-6">
        <feature.icon className="text-4xl text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          {feature.title}
        </h3>
        <p className="text-blue-600">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export default Features;
