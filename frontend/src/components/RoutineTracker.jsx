import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useHistory } from "react-router-dom";
import { FaArrowLeft, FaDumbbell, FaCheck, FaUndo } from "react-icons/fa";

function RoutineTracker() {
  const [routine, setRoutine] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchRoutine = async () => {
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
        setCompletedExercises(
          new Array(response.data.exercises.length).fill(false),
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routine:", error);
        setError("Failed to load routine. Please try again.");
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [id]);

  const handleCompleteExercise = () => {
    const newCompletedExercises = [...completedExercises];
    newCompletedExercises[currentExerciseIndex] = true;
    setCompletedExercises(newCompletedExercises);
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleUndoExercise = () => {
    if (currentExerciseIndex > 0) {
      const newCompletedExercises = [...completedExercises];
      newCompletedExercises[currentExerciseIndex - 1] = false;
      setCompletedExercises(newCompletedExercises);
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/completed-workouts/`,
        { routine: id },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      history.push("/dashboard");
    } catch (error) {
      console.error("Error saving completed workout:", error);
      setError("Failed to save completed workout. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!routine) return <div className="text-center mt-8">No routine found</div>;

  const currentExercise = routine.exercises[currentExerciseIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-3xl font-bold">
            {routine.name} - Workout Tracker
          </h1>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Current Exercise: {currentExercise.exercise_type}
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <FaDumbbell className="mr-2" />
              {currentExercise.exercise_type}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {currentExercise.sets && <p>Sets: {currentExercise.sets}</p>}
              {currentExercise.reps && <p>Reps: {currentExercise.reps}</p>}
              {currentExercise.duration && (
                <p>Duration: {currentExercise.duration} minutes</p>
              )}
              {currentExercise.distance && (
                <p>Distance: {currentExercise.distance} km</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleUndoExercise}
              disabled={currentExerciseIndex === 0}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaUndo className="mr-2" />
              Undo Previous
            </button>
            <button
              onClick={handleCompleteExercise}
              disabled={
                currentExerciseIndex === routine.exercises.length - 1 &&
                completedExercises[currentExerciseIndex]
              }
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaCheck className="mr-2" />
              Complete Exercise
            </button>
          </div>
          {currentExerciseIndex === routine.exercises.length - 1 &&
            completedExercises[currentExerciseIndex] && (
              <button
                onClick={handleFinishWorkout}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Finish Workout
              </button>
            )}
        </div>
        <div className="bg-gray-100 px-6 py-4">
          <Link
            to={`/routine/${id}`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <FaArrowLeft className="mr-2" />
            Back to Routine Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoutineTracker;
