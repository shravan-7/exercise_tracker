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
        `http://localhost:8000/api/routines/${id}/`,
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
      await axios.delete(`http://localhost:8000/api/routines/${id}/`, {
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden transform transition-all hover:scale-105">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
          <h1 className="text-3xl font-bold">{routine.name}</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Exercises</h2>
            <button
              onClick={handleStartWorkout}
              className=" mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 flex items-center"
            >
              <FaPlay className="mr-2" />
              Start Workout
            </button>
            <div className="space-x-4">
              <button
                onClick={handleEdit}
                className="ml-6 mb-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Routine
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 flex items-center"
              >
                <FaTrashAlt className="mr-2" />
                Delete Routine
              </button>
            </div>
          </div>
          {routine.exercises && routine.exercises.length > 0 ? (
            <ul className="space-y-6">
              {routine.exercises.map((exercise, index) => (
                <li
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaDumbbell className="mr-3 text-indigo-600" />
                    {exercise.exercise_type}
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                    {exercise.sets && (
                      <div className="flex items-center bg-white p-3 rounded-lg shadow">
                        <FaDumbbell className="mr-2 text-blue-500" />
                        <span className="font-medium">
                          Sets: {exercise.sets}
                        </span>
                      </div>
                    )}
                    {exercise.reps && (
                      <div className="flex items-center bg-white p-3 rounded-lg shadow">
                        <FaRunning className="mr-2 text-green-500" />
                        <span className="font-medium">
                          Reps: {exercise.reps}
                        </span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="flex items-center bg-white p-3 rounded-lg shadow">
                        <FaStopwatch className="mr-2 text-yellow-500" />
                        <span className="font-medium">
                          Duration: {exercise.duration} minutes
                        </span>
                      </div>
                    )}
                    {exercise.distance && (
                      <div className="flex items-center bg-white p-3 rounded-lg shadow">
                        <FaRulerHorizontal className="mr-2 text-purple-500" />
                        <span className="font-medium">
                          Distance: {exercise.distance} km
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center text-lg">
              No exercises in this routine.
            </p>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                        Are you sure you want to delete this routine? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutineDetails;
