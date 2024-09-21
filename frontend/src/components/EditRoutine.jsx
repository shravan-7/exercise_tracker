import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

function EditRoutine() {
  const [routine, setRoutine] = useState({ name: "", exercises: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchRoutineDetails = async () => {
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
    };

    fetchRoutineDetails();
  }, [id]);

  const handleNameChange = (e) => {
    setRoutine({ ...routine, name: e.target.value });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...routine.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setRoutine({ ...routine, exercises: updatedExercises });
  };

  const handleAddExercise = () => {
    setRoutine({
      ...routine,
      exercises: [
        ...routine.exercises,
        { exercise_type: "", sets: "", reps: "", duration: "", distance: "" },
      ],
    });
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = routine.exercises.filter((_, i) => i !== index);
    setRoutine({ ...routine, exercises: updatedExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/routines/${id}/`, routine, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      history.push(`/routine/${id}`);
    } catch (error) {
      console.error("Error updating routine:", error);
      setError("Failed to update routine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-3xl font-bold">Edit Routine</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              value={routine.name}
              onChange={handleNameChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Exercises</h2>
            {routine.exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 shadow space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Exercise {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
                <select
                  value={exercise.exercise_type}
                  onChange={(e) =>
                    handleExerciseChange(index, "exercise_type", e.target.value)
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select exercise type</option>
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Balance">Balance</option>
                  <option value="Plyometric">Plyometric</option>
                  <option value="Bodyweight">Bodyweight</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) =>
                      handleExerciseChange(index, "sets", e.target.value)
                    }
                    placeholder="Sets"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) =>
                      handleExerciseChange(index, "reps", e.target.value)
                    }
                    placeholder="Reps"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) =>
                      handleExerciseChange(index, "duration", e.target.value)
                    }
                    placeholder="Duration (minutes)"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={exercise.distance}
                    onChange={(e) =>
                      handleExerciseChange(index, "distance", e.target.value)
                    }
                    placeholder="Distance (km)"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddExercise}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Add Exercise
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaSave className="mr-2" />
            {loading ? "Updating..." : "Update Routine"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRoutine;
