import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Routine
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Routine Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="space-y-2 p-4 border border-gray-200 rounded-md"
          >
            <select
              value={exercise.exercise}
              onChange={(e) =>
                handleExerciseChange(index, "exercise", e.target.value)
              }
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select exercise</option>
              {availableExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.exercise_type})
                </option>
              ))}
            </select>
            {errors[`exercise_${index}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`exercise_${index}`]}
              </p>
            )}
            {exercise.exercise && (
              <>
                {["Strength", "Plyometric", "Bodyweight"].includes(
                  availableExercises.find(
                    (ex) => ex.id === parseInt(exercise.exercise),
                  )?.exercise_type,
                ) && (
                  <>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(index, "sets", e.target.value)
                      }
                      placeholder="Sets"
                      className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`sets_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`sets_${index}`]}
                      </p>
                    )}
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(index, "reps", e.target.value)
                      }
                      placeholder="Reps"
                      className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`reps_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`reps_${index}`]}
                      </p>
                    )}
                  </>
                )}
                {["Cardio", "Flexibility", "Balance"].includes(
                  availableExercises.find(
                    (ex) => ex.id === parseInt(exercise.exercise),
                  )?.exercise_type,
                ) && (
                  <>
                    <input
                      type="number"
                      value={exercise.duration}
                      onChange={(e) =>
                        handleExerciseChange(index, "duration", e.target.value)
                      }
                      placeholder="Duration (minutes)"
                      className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`duration_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`duration_${index}`]}
                      </p>
                    )}
                  </>
                )}
                {availableExercises.find(
                  (ex) => ex.id === parseInt(exercise.exercise),
                )?.exercise_type === "Cardio" && (
                  <>
                    <input
                      type="number"
                      value={exercise.distance}
                      onChange={(e) =>
                        handleExerciseChange(index, "distance", e.target.value)
                      }
                      placeholder="Distance (km)"
                      className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`distance_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`distance_${index}`]}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => handleRemoveExercise(index)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExercise}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Exercise
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Routine"}
        </button>
      </form>
    </div>
  );
}

export default CreateRoutine;
