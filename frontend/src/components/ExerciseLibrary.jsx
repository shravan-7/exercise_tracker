import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaStar,
  FaInfoCircle,
  FaVideo,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [exerciseOfTheDay, setExerciseOfTheDay] = useState(null);

  useEffect(() => {
    fetchExercises();
    fetchMuscleGroups();
    fetchFavoriteExercises();
    fetchExerciseOfTheDay();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exercises/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const fetchMuscleGroups = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/muscle-groups/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setMuscleGroups(response.data);
    } catch (error) {
      console.error("Error fetching muscle groups:", error);
    }
  };

  const fetchFavoriteExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/favorite-exercises/",
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
  };

  const fetchExerciseOfTheDay = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exercise-of-the-day/",
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
  };

  const toggleFavorite = async (exerciseId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/toggle-favorite-exercise/",
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
        "http://localhost:8000/api/add-to-workout/",
        { exercise_id: exerciseId },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Exercise added to workout plan");
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
      toast.error("Failed to add exercise to workout plan");
    }
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedMuscleGroup === "All" ||
        exercise.muscle_group === selectedMuscleGroup),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Exercise Library
        </h1>

        {exerciseOfTheDay && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-2 text-indigo-600">
              Exercise of the Day
            </h2>
            <p className="text-xl font-medium text-gray-800">
              {exerciseOfTheDay.name}
            </p>
            <p className="text-gray-600 mt-2">{exerciseOfTheDay.description}</p>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
          >
            <option value="All">All Muscle Groups</option>
            {muscleGroups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {exercise.name}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(exercise.id)}
                      className={`text-2xl ${
                        favoriteExercises.includes(exercise.id)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } hover:text-yellow-600 transition-colors duration-200`}
                    >
                      <FaStar />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {exercise.description}
                  </p>
                  <p className="text-sm text-indigo-600 font-medium mb-4">
                    Muscle Group: {exercise.muscle_group}
                  </p>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <button className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200">
                      <FaInfoCircle className="mr-2" /> Details
                    </button>
                    <button className="flex items-center text-green-500 hover:text-green-700 transition-colors duration-200">
                      <FaVideo className="mr-2" /> Video
                    </button>
                  </div>
                  <button
                    onClick={() => addToWorkout(exercise.id)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" /> Add to Workout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExerciseLibrary;
