import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FaSearch,
  FaChevronDown,
  FaStar,
  FaInfoCircle,
  FaVideo,
  FaPlus,
  FaDumbbell,
  FaTimes,
  FaFilter,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "./CustomToast";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [muscleGroupsMap, setMuscleGroupsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [exerciseOfTheDay, setExerciseOfTheDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const fetchExercises = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/exercises/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }, []);

  const fetchMuscleGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/muscle-groups/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setMuscleGroups(response.data);
      const muscleGroupsObj = {};
      response.data.forEach((group) => {
        muscleGroupsObj[group.id] = group.name;
      });
      setMuscleGroupsMap(muscleGroupsObj);
    } catch (error) {
      console.error("Error fetching muscle groups:", error);
    }
  }, []);

  const fetchFavoriteExercises = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/exercises/favorites/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setFavoriteExercises(response.data);
    } catch (error) {
      console.error("Error fetching favorite exercises:", error);
    }
  }, []);

  const fetchExerciseOfTheDay = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/exercise-of-the-day/today/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setExerciseOfTheDay(response.data);
    } catch (error) {
      console.error("Error fetching exercise of the day:", error);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
    fetchMuscleGroups();
    fetchFavoriteExercises();
    fetchExerciseOfTheDay();
  }, [
    fetchExercises,
    fetchMuscleGroups,
    fetchFavoriteExercises,
    fetchExerciseOfTheDay,
  ]);

  const toggleFavorite = async (exerciseId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_REACT_URL}/api/exercises/toggle_favorite/`,
        { exercise_id: exerciseId },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setFavoriteExercises(response.data);
    } catch (error) {
      console.error("Error toggling favorite exercise:", error);
    }
  };

  const addToWorkout = async (exerciseId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_REACT_URL}/api/add-to-workout/`,
        { exercise_id: exerciseId },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      showToast("Exercise added to workout plan", "success");
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
      showToast("Failed to add exercise to workout plan", "error");
    }
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedMuscleGroup === "All" ||
        muscleGroupsMap[exercise.muscle_group] === selectedMuscleGroup),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-gray-900 mb-12 text-center"
        >
          Exercise Library
        </motion.h1>

        {exerciseOfTheDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl mb-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <h2 className="text-3xl font-bold mb-4">Exercise of the Day</h2>
            <p className="text-2xl font-medium mb-2">
              {exerciseOfTheDay.exercise.name}
            </p>
            <p className="text-lg opacity-80">
              {exerciseOfTheDay.exercise.description}
            </p>
            <FaDumbbell className="absolute bottom-4 right-4 text-5xl opacity-20" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center space-x-4"
        >
          <motion.div
            className="relative flex-grow"
            initial={false}
            animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-lg focus:shadow-xl border-2 border-transparent focus:border-indigo-500 transition-all duration-300 outline-none text-gray-700 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 text-xl"
              animate={isSearchFocused ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaSearch />
            </motion.div>
          </motion.div>
          <motion.div
            className="relative w-64"
            initial={false}
            animate={isSelectFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <select
              className="appearance-none w-full pl-12 pr-10 py-4 bg-white rounded-full shadow-lg focus:shadow-xl border-2 border-transparent focus:border-indigo-500 transition-all duration-300 outline-none text-gray-700 cursor-pointer text-lg"
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
            >
              <option value="All">All Muscle Groups</option>
              {muscleGroups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 text-xl"
              animate={isSelectFocused ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaFilter />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500"
              animate={isSelectFocused ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="fill-current h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredExercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                <div className="p-8 h-full flex flex-col justify-between relative">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {exercise.name}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(exercise.id)}
                        className={`text-3xl ${
                          favoriteExercises.includes(exercise.id)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        } hover:text-yellow-600 transition-colors duration-200`}
                      >
                        <FaStar />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {exercise.description}
                    </p>
                    <span className="inline-block bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      {muscleGroupsMap[exercise.muscle_group]}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-3 mt-6">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedExercise(exercise)}
                        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      >
                        <FaInfoCircle className="mr-2" /> Details
                      </button>
                      <button className="flex items-center text-green-500 hover:text-green-700 transition-colors duration-200">
                        <FaVideo className="mr-2" /> Video
                      </button>
                    </div>
                    <button
                      onClick={() => addToWorkout(exercise.id)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center"
                    >
                      <FaPlus className="mr-2" /> Add to Workout
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedExercise.name}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {selectedExercise.description}
              </p>
              <div className="flex items-center mb-6">
                <span className="mr-2 font-medium text-gray-700">
                  Muscle Group:
                </span>
                <span className="inline-block bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  {muscleGroupsMap[selectedExercise.muscle_group]}
                </span>
              </div>
              <a
                href="#" // Replace with actual video link
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200 mb-6"
              >
                <FaVideo className="mr-2" /> Watch Exercise Video
              </a>
              <button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-200"
                onClick={() => setSelectedExercise(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExerciseLibrary;
