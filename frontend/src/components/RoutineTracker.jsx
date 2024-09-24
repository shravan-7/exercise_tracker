import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDumbbell,
  FaCheck,
  FaUndo,
  FaPlay,
  FaPause,
  FaStop,
  FaStickyNote,
  FaFire,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function RoutineTracker() {
  const [routine, setRoutine] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [notes, setNotes] = useState({});
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  const synth = window.speechSynthesis;

  const fetchRoutine = useCallback(async () => {
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
      setCompletedExercises(
        new Array(response.data.exercises.length).fill(false),
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routine:", error);
      setError("Failed to load routine. Please try again.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoutine();
  }, [fetchRoutine]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, []);

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const startRestTimer = () => {
    setIsRestTimerRunning(true);
    restTimerRef.current = setInterval(() => {
      setRestTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(restTimerRef.current);
          setIsRestTimerRunning(false);
          speak("Rest time is over. Get ready for the next exercise.");
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleCompleteExercise = () => {
    const newCompleted = [...completedExercises];
    newCompleted[currentExerciseIndex] = true;
    setCompletedExercises(newCompleted);

    // Calculate calories burned (this is a simplified calculation)
    const exerciseDuration = timer / 60; // Convert seconds to minutes
    const caloriesPerMinute = 5; // Adjust this based on exercise intensity
    const caloriesBurnedForExercise = exerciseDuration * caloriesPerMinute;
    setCaloriesBurned((prev) => prev + caloriesBurnedForExercise);

    resetTimer();

    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setRestTimer(60); // Set rest timer to 60 seconds
      startRestTimer();
      speak("Great job! Take a short rest before the next exercise.");
    } else {
      speak("Congratulations! You've completed your workout.");
    }
  };

  const handleUndoExercise = () => {
    if (currentExerciseIndex > 0) {
      const newCompleted = [...completedExercises];
      newCompleted[currentExerciseIndex - 1] = false;
      setCompletedExercises(newCompleted);
      setCurrentExerciseIndex((prev) => prev - 1);
      resetTimer();
    }
  };

  const handleFinishWorkout = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/completed-workouts/`,
        {
          routine: id,
          calories_burned: Math.round(caloriesBurned),
          notes: JSON.stringify(notes),
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Workout completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving completed workout:", error);
      toast.error("Failed to save completed workout. Please try again.");
    }
  };

  const handleNoteChange = (exerciseId, note) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [exerciseId]: note,
    }));
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!routine) return <div className="text-center mt-8">No routine found</div>;

  const currentExercise = routine.exercises[currentExerciseIndex];
  const progress = (currentExerciseIndex / routine.exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
          <h1 className="text-3xl font-bold">
            {routine.name} - Workout Tracker
          </h1>
          <div className="mt-2 bg-white bg-opacity-20 rounded-full">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Exercise {currentExerciseIndex + 1} of {routine.exercises.length}:{" "}
            {currentExercise.exercise_name}
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <FaDumbbell className="mr-2 text-indigo-600" />
              {currentExercise.exercise_name}
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
          <div className="mt-6">
            <div className="text-4xl font-bold text-center text-indigo-600 mb-4">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
                >
                  <FaPlay className="mr-2" />
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
                >
                  <FaPause className="mr-2" />
                  Pause
                </button>
              )}
              <button
                onClick={resetTimer}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
              >
                <FaStop className="mr-2" />
                Reset
              </button>
            </div>
          </div>
          {isRestTimerRunning && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Rest Time:</p>
              <p className="text-3xl font-bold text-green-600">{restTimer}s</p>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleUndoExercise}
              disabled={currentExerciseIndex === 0}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaUndo className="mr-2" />
              Undo Previous
            </button>
            <button
              onClick={handleCompleteExercise}
              disabled={isRestTimerRunning}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaCheck className="mr-2" />
              Complete Exercise
            </button>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
            >
              <FaStickyNote className="mr-2" />
              {showNotes ? "Hide Notes" : "Show Notes"}
            </button>
            <div className="flex items-center text-gray-700">
              <FaFire className="text-orange-500 mr-2" />
              <span className="font-semibold">
                Calories Burned: {Math.round(caloriesBurned)}
              </span>
            </div>
          </div>
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <textarea
                  value={notes[currentExercise.id] || ""}
                  onChange={(e) =>
                    handleNoteChange(currentExercise.id, e.target.value)
                  }
                  placeholder="Add notes for this exercise..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </motion.div>
            )}
          </AnimatePresence>
          {currentExerciseIndex === routine.exercises.length - 1 &&
            completedExercises[currentExerciseIndex] && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleFinishWorkout}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition duration-150 ease-in-out"
              >
                Finish Workout
              </motion.button>
            )}
        </div>
        <div className="bg-gray-100 px-6 py-4">
          <Link
            to={`/routine/${id}`}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out"
          >
            <FaArrowLeft className="mr-2" />
            Back to Routine Details
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RoutineTracker;
