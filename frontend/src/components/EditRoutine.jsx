import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaDumbbell, FaArrowLeft } from "react-icons/fa";
import { showToast } from "./CustomToast";
import { motion } from "framer-motion";

const exerciseTypes = [
  "Strength",
  "Cardio",
  "Flexibility",
  "Balance",
  "Plyometric",
  "Bodyweight",
];

function EditRoutine() {
  const [routine, setRoutine] = useState({ name: "", exercises: [] });
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [routineResponse, exercisesResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/routines/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/exercises/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const formattedRoutine = {
        ...routineResponse.data,
        exercises: routineResponse.data.exercises.map((ex) => ({
          ...ex,
          exerciseType: ex.exercise_type,
          exercise: ex.exercise,
        })),
      };

      setRoutine(formattedRoutine);
      setAllExercises(exercisesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNameChange = useCallback((e) => {
    setRoutine((prevRoutine) => ({ ...prevRoutine, name: e.target.value }));
  }, []);

  const handleExerciseChange = useCallback(
    (index, field, value) => {
      setRoutine((prevRoutine) => {
        const updatedExercises = [...prevRoutine.exercises];
        if (field === "exerciseType") {
          updatedExercises[index] = {
            ...updatedExercises[index],
            exerciseType: value,
            exercise: "",
          };
        } else if (field === "exercise") {
          const selectedExercise = allExercises.find(
            (ex) => ex.id === parseInt(value, 10),
          );
          updatedExercises[index] = {
            ...updatedExercises[index],
            exercise: parseInt(value, 10),
            exercise_type: selectedExercise
              ? selectedExercise.exercise_type
              : "",
          };
        } else {
          updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value,
          };
        }
        return { ...prevRoutine, exercises: updatedExercises };
      });
    },
    [allExercises],
  );

  const handleAddExercise = useCallback(() => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      exercises: [
        ...prevRoutine.exercises,
        {
          exerciseType: "",
          exercise: "",
          sets: "",
          reps: "",
          duration: "",
          distance: "",
        },
      ],
    }));
  }, []);

  const handleRemoveExercise = useCallback((index) => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      exercises: prevRoutine.exercises.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const updatedRoutine = {
          ...routine,
          exercises: routine.exercises.map((exercise) => ({
            ...(exercise.id && { id: exercise.id }),
            exercise: exercise.exercise,
            sets: exercise.sets || null,
            reps: exercise.reps || null,
            duration: exercise.duration || null,
            distance: exercise.distance || null,
          })),
        };
        console.log("Sending data:", JSON.stringify(updatedRoutine, null, 2));
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/routines/${id}/`,
          updatedRoutine,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("Response:", response.data);
        showToast("Routine updated successfully!", "success");
        navigate(`/routine/${id}`);
      } catch (error) {
        console.error(
          "Error updating routine:",
          error.response?.data || error.message,
        );
        showToast(
          `Failed to update routine: ${error.response?.data?.detail || "Please try again."}`,
          "error",
        );
      } finally {
        setLoading(false);
      }
    },
    [routine, id, navigate],
  );

  const shouldShowField = (exerciseType, field) => {
    switch (field) {
      case "sets":
      case "reps":
        return ["Strength", "Bodyweight", "Plyometric"].includes(exerciseType);
      case "duration":
        return ["Cardio", "Flexibility", "Balance"].includes(exerciseType);
      case "distance":
        return exerciseType === "Cardio";
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600 text-xl">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen"
    >
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Routine</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-full flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Routine Name
            </label>
            <input
              type="text"
              id="name"
              value={routine.name}
              onChange={handleNameChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
              required
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaDumbbell className="mr-3 text-blue-500" />
              Exercises
            </h2>
            {routine.exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-xl p-6 shadow-md space-y-4 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-gray-900">
                    Exercise {index + 1}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise Type
                    </label>
                    <select
                      value={exercise.exerciseType || ""}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "exerciseType",
                          e.target.value,
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="">Select exercise type</option>
                      {exerciseTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise
                    </label>
                    <select
                      value={exercise.exercise || ""}
                      onChange={(e) =>
                        handleExerciseChange(index, "exercise", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="">Select exercise</option>
                      {allExercises
                        .filter(
                          (ex) => ex.exercise_type === exercise.exerciseType,
                        )
                        .map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {shouldShowField(exercise.exerciseType, "sets") && (
                    <input
                      type="number"
                      value={exercise.sets || ""}
                      onChange={(e) =>
                        handleExerciseChange(index, "sets", e.target.value)
                      }
                      placeholder="Sets"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  )}
                  {shouldShowField(exercise.exerciseType, "reps") && (
                    <input
                      type="number"
                      value={exercise.reps || ""}
                      onChange={(e) =>
                        handleExerciseChange(index, "reps", e.target.value)
                      }
                      placeholder="Reps"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  )}
                  {shouldShowField(exercise.exerciseType, "duration") && (
                    <input
                      type="number"
                      value={exercise.duration || ""}
                      onChange={(e) =>
                        handleExerciseChange(index, "duration", e.target.value)
                      }
                      placeholder="Duration (minutes)"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  )}
                  {shouldShowField(exercise.exerciseType, "distance") && (
                    <input
                      type="number"
                      value={exercise.distance || ""}
                      onChange={(e) =>
                        handleExerciseChange(index, "distance", e.target.value)
                      }
                      placeholder="Distance (km)"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddExercise}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              <FaPlus className="mr-2" />
              Add Exercise
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-8 py-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Routine"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditRoutine;
