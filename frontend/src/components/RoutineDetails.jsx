import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaArrowLeft,
  FaDumbbell,
  FaRunning,
  FaStopwatch,
  FaRulerHorizontal,
  FaPlay,
  FaTrashAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

function RoutineDetails() {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRoutineDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/routines/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setRoutine(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routine details:", error);
      setError("Failed to load routine details. Please try again.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoutineDetails();
  }, [fetchRoutineDetails]);

  const handleEdit = () => {
    navigate(`/edit-routine/${id}`);
  };

  const handleStartWorkout = () => {
    navigate(`/track-routine/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/routines/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting routine:", error);
      setError("Failed to delete routine. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-8 text-red-600 text-xl font-semibold">
        {error}
      </div>
    );
  if (!routine)
    return (
      <div className="text-center mt-8 text-gray-600 text-xl font-semibold">
        Routine not found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen"
    >
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
          <h1 className="text-4xl font-bold">{routine.name}</h1>
        </div>
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Exercises
            </h2>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartWorkout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg"
              >
                <FaPlay className="mr-2" />
                Start Workout
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg"
              >
                <FaEdit className="mr-2" />
                Edit Routine
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg"
              >
                <FaTrashAlt className="mr-2" />
                Delete Routine
              </motion.button>
            </div>
          </div>
          {routine.exercises && routine.exercises.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-6"
            >
              {routine.exercises.map((exercise, index) => (
                <motion.li
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                    <FaDumbbell className="mr-3 text-indigo-600" />
                    {exercise.exercise_name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Type: {exercise.exercise_type}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                    {exercise.sets && (
                      <div className="flex items-center bg-white p-4 rounded-xl shadow">
                        <FaDumbbell className="mr-3 text-blue-500 text-xl" />
                        <span className="font-medium text-lg">
                          Sets: {exercise.sets}
                        </span>
                      </div>
                    )}
                    {exercise.reps && (
                      <div className="flex items-center bg-white p-4 rounded-xl shadow">
                        <FaRunning className="mr-3 text-green-500 text-xl" />
                        <span className="font-medium text-lg">
                          Reps: {exercise.reps}
                        </span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="flex items-center bg-white p-4 rounded-xl shadow">
                        <FaStopwatch className="mr-3 text-yellow-500 text-xl" />
                        <span className="font-medium text-lg">
                          Duration: {exercise.duration} minutes
                        </span>
                      </div>
                    )}
                    {exercise.distance && (
                      <div className="flex items-center bg-white p-4 rounded-xl shadow">
                        <FaRulerHorizontal className="mr-3 text-purple-500 text-xl" />
                        <span className="font-medium text-lg">
                          Distance: {exercise.distance} km
                        </span>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-gray-500 text-center text-xl">
              No exercises in this routine.
            </p>
          )}
        </div>
        <div className="bg-gray-50 px-8 py-6">
          <Link
            to="/dashboard"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out font-semibold text-lg"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaTrashAlt className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Routine
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this routine? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleDelete}
              >
                Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default RoutineDetails;
