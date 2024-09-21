import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useHistory } from "react-router-dom";
import {
  FaEdit,
  FaArrowLeft,
  FaDumbbell,
  FaRunning,
  FaStopwatch,
  FaRulerHorizontal,
  FaPlay,
} from "react-icons/fa";

function RoutineDetails() {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/routines/${id}/`,
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
    };

    fetchRoutineDetails();
  }, [id]);

  const handleEdit = () => {
    history.push(`/edit-routine/${id}`);
  };

  const handleStartWorkout = () => {
    history.push(`/track-routine/${id}`);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!routine)
    return <div className="text-center mt-8">Routine not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{routine.name}</h1>
          <div>
            <button
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center mr-2"
            >
              <FaEdit className="mr-2" />
              Edit Routine
            </button>
            <button
              onClick={handleStartWorkout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center"
            >
              <FaPlay className="mr-2" />
              Start Workout
            </button>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Exercises
          </h2>
          {routine.exercises && routine.exercises.length > 0 ? (
            <ul className="space-y-4">
              {routine.exercises.map((exercise, index) => (
                <li key={index} className="bg-gray-100 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <FaDumbbell className="mr-2" />
                    {exercise.exercise_type}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {exercise.sets && (
                      <div className="flex items-center">
                        <FaDumbbell className="mr-2" />
                        <span>Sets: {exercise.sets}</span>
                      </div>
                    )}
                    {exercise.reps && (
                      <div className="flex items-center">
                        <FaRunning className="mr-2" />
                        <span>Reps: {exercise.reps}</span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="flex items-center">
                        <FaStopwatch className="mr-2" />
                        <span>Duration: {exercise.duration} minutes</span>
                      </div>
                    )}
                    {exercise.distance && (
                      <div className="flex items-center">
                        <FaRulerHorizontal className="mr-2" />
                        <span>Distance: {exercise.distance} km</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No exercises in this routine.</p>
          )}
        </div>
        <div className="bg-gray-100 px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoutineDetails;
