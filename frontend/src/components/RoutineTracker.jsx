import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaUndo,
  FaPlay,
  FaPause,
  FaStop,
  FaStickyNote,
  FaFire,
  FaForward,
  FaPlus,
  FaMinus,
  FaTimes,
} from "react-icons/fa";
import { showToast } from "./CustomToast";
import { motion, AnimatePresence } from "framer-motion";
const CustomDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [isSkipping, setIsSkipping] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  const synth = window.speechSynthesis;

  const fetchRoutine = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/routines/${id}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
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

  const increaseRestTime = () => {
    setRestTimer((prevTimer) => prevTimer + 30);
  };

  const decreaseRestTime = () => {
    setRestTimer((prevTimer) => Math.max(0, prevTimer - 30));
  };

  const cancelRestTime = () => {
    clearInterval(restTimerRef.current);
    setIsRestTimerRunning(false);
    setRestTimer(0);
    speak("Rest time cancelled. Moving to the next exercise.");
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleCompleteExercise = () => {
    const newCompleted = [...completedExercises];
    newCompleted[currentExerciseIndex] = true;
    setCompletedExercises(newCompleted);

    const exerciseDuration = timer / 60;
    const caloriesPerMinute = 5;
    const caloriesBurnedForExercise = exerciseDuration * caloriesPerMinute;
    setCaloriesBurned((prev) => prev + caloriesBurnedForExercise);

    handleNextExercise();
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

  const handleSkipExercise = () => {
    setIsSkipDialogOpen(true);
  };

  const confirmSkipExercise = () => {
    setIsSkipping(true);
    const newCompleted = [...completedExercises];
    newCompleted[currentExerciseIndex] = true;
    setCompletedExercises(newCompleted);
    handleNextExercise();
    setIsSkipping(false);
    setIsSkipDialogOpen(false);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      resetTimer();
      setRestTimer(60);
      startRestTimer();
      speak("Moving to the next exercise.");
    } else {
      speak("This is the last exercise. You've completed your workout!");
    }
  };

  const handleFinishWorkout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/completed-workouts/`,
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
      showToast("Workout completed successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving completed workout:", error);
      showToast("Failed to save completed workout. Please try again.", "error");
    }
  };

  const handleNoteChange = (exerciseId, note) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [exerciseId]: note,
    }));
  };

  const ExerciseDetailsCard = ({ exercise }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-2xl font-bold text-indigo-600 mb-4">
        {exercise.exercise_name}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {exercise.sets && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-100 p-3 rounded-lg"
          >
            <p className="text-blue-800 font-semibold">Sets</p>
            <p className="text-3xl font-bold text-blue-600">{exercise.sets}</p>
          </motion.div>
        )}
        {exercise.reps && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-100 p-3 rounded-lg"
          >
            <p className="text-green-800 font-semibold">Reps</p>
            <p className="text-3xl font-bold text-green-600">{exercise.reps}</p>
          </motion.div>
        )}
        {exercise.duration && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-100 p-3 rounded-lg"
          >
            <p className="text-yellow-800 font-semibold">Duration</p>
            <p className="text-3xl font-bold text-yellow-600">
              {exercise.duration} min
            </p>
          </motion.div>
        )}
        {exercise.distance && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-100 p-3 rounded-lg"
          >
            <p className="text-purple-800 font-semibold">Distance</p>
            <p className="text-3xl font-bold text-purple-600">
              {exercise.distance} km
            </p>
          </motion.div>
        )}
      </div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-4 p-3 bg-gray-100 rounded-lg"
      >
        <p className="text-gray-700 font-semibold">Exercise Type</p>
        <p className="text-xl font-bold text-gray-800">
          {exercise.exercise_type}
        </p>
      </motion.div>
    </motion.div>
  );

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
            <motion.div
              className="bg-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
          </h2>

          <ExerciseDetailsCard exercise={currentExercise} />

          {/* Timer and control buttons */}
          <AnimatePresence>
            {!isRestTimerRunning && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className="text-4xl font-bold text-center text-indigo-600 mb-4">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                  {!isTimerRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startTimer}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
                    >
                      <FaPlay className="mr-2" />
                      Start
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={pauseTimer}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
                    >
                      <FaPause className="mr-2" />
                      Pause
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTimer}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center"
                  >
                    <FaStop className="mr-2" />
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rest timer section */}
          <AnimatePresence>
            {isRestTimerRunning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-blue-100 p-4 rounded-lg"
              >
                <p className="text-lg font-semibold text-blue-800">
                  Rest Time:
                </p>
                <p className="text-3xl font-bold text-blue-600">{restTimer}s</p>
                <div className="flex justify-center space-x-4 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={decreaseRestTime}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-full transition duration-150 ease-in-out"
                  >
                    <FaMinus />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={increaseRestTime}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-full transition duration-150 ease-in-out"
                  >
                    <FaPlus />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={cancelRestTime}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full transition duration-150 ease-in-out"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercise control buttons */}
          <div className="mt-6 flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUndoExercise}
              disabled={currentExerciseIndex === 0 || isRestTimerRunning}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaUndo className="mr-2" />
              Undo Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteExercise}
              disabled={isRestTimerRunning || isSkipping}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaCheck className="mr-2" />
              Complete Exercise
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkipExercise}
              disabled={
                isRestTimerRunning ||
                isSkipping ||
                currentExerciseIndex === routine.exercises.length - 1
              }
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center disabled:opacity-50"
            >
              <FaForward className="mr-2" />
              Skip Exercise
            </motion.button>
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

      {/* Skip Exercise Confirmation Dialog */}
      <CustomDialog
        isOpen={isSkipDialogOpen}
        onClose={() => setIsSkipDialogOpen(false)}
        onConfirm={confirmSkipExercise}
        title="Skip Exercise"
        description="Are you sure you want to skip this exercise? This action cannot be undone."
      />
    </div>
  );
}

export default RoutineTracker;
