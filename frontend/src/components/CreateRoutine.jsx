import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaPlusCircle,
  FaMinusCircle,
  FaDumbbell,
  FaRunning,
  FaStopwatch,
  FaRulerHorizontal,
} from "react-icons/fa";

function CreateRoutine() {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableExercises, setAvailableExercises] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/exercises/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        setAvailableExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        toast.error("Failed to fetch exercises. Please try again.");
      }
    };

    fetchExercises();
    setExercises([
      { exercise: "", sets: "", reps: "", duration: "", distance: "" },
    ]);
  }, []);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { exercise: "", sets: "", reps: "", duration: "", distance: "" },
    ]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Routine name is required";

    exercises.forEach((exercise, index) => {
      if (!exercise.exercise)
        newErrors[`exercise_${index}`] = "Exercise is required";

      const selectedExercise = availableExercises.find(
        (ex) => ex.id === parseInt(exercise.exercise),
      );
      if (selectedExercise) {
        if (
          ["Strength", "Plyometric", "Bodyweight"].includes(
            selectedExercise.exercise_type,
          )
        ) {
          if (!exercise.sets) newErrors[`sets_${index}`] = "Sets are required";
          if (!exercise.reps) newErrors[`reps_${index}`] = "Reps are required";
        }

        if (
          ["Cardio", "Flexibility", "Balance"].includes(
            selectedExercise.exercise_type,
          )
        ) {
          if (!exercise.duration)
            newErrors[`duration_${index}`] = "Duration is required";
        }

        if (selectedExercise.exercise_type === "Cardio") {
          if (!exercise.distance)
            newErrors[`distance_${index}`] = "Distance is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const routineData = {
      name,
      exercises: exercises.map((ex) => ({
        exercise: parseInt(ex.exercise),
        sets: ex.sets ? parseInt(ex.sets) : null,
        reps: ex.reps ? parseInt(ex.reps) : null,
        duration: ex.duration ? parseInt(ex.duration) : null,
        distance: ex.distance ? parseFloat(ex.distance) : null,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/routines/",
        routineData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Response:", response.data);
      toast.success("Routine created successfully!");
      history.push("/dashboard");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      toast.error("Failed to create routine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h1 className="text-3xl font-extrabold text-white">
            Create New Routine
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Enter routine name"
            />
            <label
              htmlFor="name"
              className="absolute left-2 -top-3 bg-white px-2 text-sm font-medium text-gray-600"
            >
              Routine Name
            </label>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white"
              >
                <div className="flex flex-wrap items-center mb-4">
                  <FaDumbbell className="text-blue-500 mr-2 text-xl" />
                  <div className="relative flex-grow">
                    <select
                      value={exercise.exercise}
                      onChange={(e) =>
                        handleExerciseChange(index, "exercise", e.target.value)
                      }
                      className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select exercise</option>
                      {availableExercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.exercise_type})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <FaMinusCircle size={24} />
                  </button>
                </div>
                {errors[`exercise_${index}`] && (
                  <p className="text-sm text-red-600 mb-2">
                    {errors[`exercise_${index}`]}
                  </p>
                )}
                {exercise.exercise && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {["Strength", "Plyometric", "Bodyweight"].includes(
                      availableExercises.find(
                        (ex) => ex.id === parseInt(exercise.exercise),
                      )?.exercise_type,
                    ) && (
                      <>
                        <div className="relative">
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "sets",
                                e.target.value,
                              )
                            }
                            placeholder="Sets"
                            className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                          />
                          <FaDumbbell className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          {errors[`sets_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`sets_${index}`]}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "reps",
                                e.target.value,
                              )
                            }
                            placeholder="Reps"
                            className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                          />
                          <FaRunning className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          {errors[`reps_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`reps_${index}`]}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    {["Cardio", "Flexibility", "Balance"].includes(
                      availableExercises.find(
                        (ex) => ex.id === parseInt(exercise.exercise),
                      )?.exercise_type,
                    ) && (
                      <div className="relative">
                        <input
                          type="number"
                          value={exercise.duration}
                          onChange={(e) =>
                            handleExerciseChange(
                              index,
                              "duration",
                              e.target.value,
                            )
                          }
                          placeholder="Duration (minutes)"
                          className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                        />
                        <FaStopwatch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {errors[`duration_${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`duration_${index}`]}
                          </p>
                        )}
                      </div>
                    )}
                    {availableExercises.find(
                      (ex) => ex.id === parseInt(exercise.exercise),
                    )?.exercise_type === "Cardio" && (
                      <div className="relative">
                        <input
                          type="number"
                          value={exercise.distance}
                          onChange={(e) =>
                            handleExerciseChange(
                              index,
                              "distance",
                              e.target.value,
                            )
                          }
                          placeholder="Distance (km)"
                          className="w-full text-sm px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                        />
                        <FaRulerHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {errors[`distance_${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`distance_${index}`]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddExercise}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaPlusCircle className="mr-2" />
              Add Exercise
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Routine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoutine;
