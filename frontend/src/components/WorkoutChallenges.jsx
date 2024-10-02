import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaDumbbell,
  FaTimes,
  FaFire,
  FaInfoCircle,
  FaTrophy,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { showToast } from "./CustomToast";
function WorkoutChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchUserChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workout-challenges/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setChallenges(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      showToast("Failed to fetch challenges. Please try again.", "error");
      setLoading(false);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-challenges/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setUserChallenges(response.data);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      showToast("Failed to fetch your challenges. Please try again.", "error");
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/workout-challenges/${challengeId}/join/`,
        {},
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      await fetchUserChallenges();
      await fetchChallenges();
      showToast(response.data.message, "success");
      // Refresh the selected challenge details if it's currently open
      if (selectedChallenge && selectedChallenge.id === challengeId) {
        fetchChallengeDetails(challengeId);
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to join the challenge. Please try again.",
        "error",
      );
    }
  };

  const fetchChallengeDetails = async (challengeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workout-challenges/${challengeId}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setSelectedChallenge(response.data);
    } catch (error) {
      console.error("Error fetching challenge details:", error);
      showToast(
        "Failed to fetch challenge details. Please try again.",
        "error",
      );
    }
  };

  const updateProgress = async (userChallengeId, exerciseId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user-challenges/${userChallengeId}/update_progress/`,
        { exercise_id: exerciseId },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setSelectedChallenge(response.data);
      await fetchUserChallenges();
      showToast("Exercise marked as completed!", "success");
    } catch (error) {
      console.error("Error updating progress:", error);
      showToast("Failed to update progress. Please try again.", "error");
    }
  };

  const ChallengeCard = ({ challenge, isUserChallenge = false }) => {
    const challengeData = isUserChallenge ? challenge.challenge : challenge;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105"
      >
        <div className="relative h-40 sm:h-48">
          <img
            src={`${process.env.PUBLIC_URL}/images/${challengeData.name
              .toLowerCase()
              .replace(/\s+/g, "-")}.jpg`}
            alt={challengeData.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/images/default-challenge.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {challengeData.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                challengeData.difficulty === "Easy"
                  ? "bg-green-400 text-green-900"
                  : challengeData.difficulty === "Medium"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-red-400 text-red-900"
              }`}
            >
              {challengeData.difficulty}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4 h-16 sm:h-20 overflow-hidden text-sm sm:text-base">
            {challengeData.description}
          </p>
          <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 mb-4">
            <span className="flex items-center mb-2 sm:mb-0">
              <FaCalendarAlt className="mr-1" />
              {new Date(challengeData.start_date).toLocaleDateString()} -{" "}
              {new Date(challengeData.end_date).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <FaDumbbell className="mr-1" />
              Goal: {challengeData.goal}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {isUserChallenge ? (
              <>
                <div className="w-20 h-20 mb-4 sm:mb-0">
                  <CircularProgressbar
                    value={(challenge.progress / challengeData.goal) * 100}
                    text={`${challenge.progress}/${challengeData.goal}`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor: `rgba(79, 70, 229, ${
                        challenge.progress / challengeData.goal
                      })`,
                      textColor: "#4F46E5",
                      trailColor: "#d6d6d6",
                    })}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchChallengeDetails(challenge.challenge.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300 w-full sm:w-auto"
                >
                  Update Progress
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => joinChallenge(challengeData.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300 w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2"
                >
                  Join Challenge
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchChallengeDetails(challengeData.id)}
                  className="bg-gray-200 text-indigo-600 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 flex items-center justify-center w-full sm:w-auto"
                >
                  <FaInfoCircle className="mr-2" />
                  Details
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-900 mb-6 sm:mb-8 text-center"
        >
          Workout Challenges
        </motion.h1>

        <div className="mb-6 sm:mb-8">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-1 max-w-xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row">
              <button
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "available"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                } ${activeTab === "available" ? "" : " sm:mb-0 sm:mr-2"}`}
                onClick={() => setActiveTab("available")}
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                  Available Challenges
                </span>
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "active"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("active")}
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active Challenges
                </span>
              </button>
            </div>
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {(activeTab === "available" ? challenges : userChallenges).map(
                (challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    isUserChallenge={activeTab === "active"}
                  />
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Challenge Details Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-indigo-900">
                  {selectedChallenge.name}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedChallenge(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>
              <p className="text-gray-700 mb-6">
                {selectedChallenge.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                    Start Date
                  </h3>
                  <p className="text-indigo-600">
                    {new Date(
                      selectedChallenge.start_date,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-indigo-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                    End Date
                  </h3>
                  <p className="text-indigo-600">
                    {new Date(selectedChallenge.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {selectedChallenge.has_joined && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-800">
                    Progress
                  </h3>
                  <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${(selectedChallenge.progress / selectedChallenge.goal) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-right mt-1 text-indigo-600">
                    {selectedChallenge.progress} / {selectedChallenge.goal}
                  </p>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4 text-indigo-900">
                Challenge Exercises
              </h3>
              <ul className="space-y-3">
                {selectedChallenge.exercises.map((exercise) => (
                  <motion.li
                    key={exercise.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-medium text-gray-800">
                      {exercise.name}
                    </span>
                    {selectedChallenge.has_joined &&
                      (exercise.completed ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateProgress(
                              selectedChallenge.user_challenge_id,
                              exercise.id,
                            )
                          }
                          className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-600 transition duration-300 flex items-center"
                        >
                          <FaFire className="mr-2" />
                          Complete
                        </motion.button>
                      ))}
                  </motion.li>
                ))}
              </ul>
              {!selectedChallenge.has_joined && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => joinChallenge(selectedChallenge.id)}
                  className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300 w-full"
                >
                  Join This Challenge
                </motion.button>
              )}
              {selectedChallenge.has_joined && selectedChallenge.completed && (
                <div className="mt-6 text-center">
                  <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-indigo-900">
                    Congratulations!
                  </p>
                  <p className="text-gray-700">
                    You've completed this challenge!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkoutChallenges;
