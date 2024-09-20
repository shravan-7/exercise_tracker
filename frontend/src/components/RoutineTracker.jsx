import React, { useState, useEffect } from "react";
import axios from "axios";

function RoutineTracker() {
  const [routine, setRoutine] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/routines/today/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        setRoutine(response.data);
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
    };

    fetchRoutine();
  }, []);

  const handleExerciseComplete = async (exerciseId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/completed-exercises/",
        { exercise: exerciseId },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setCompletedExercises([...completedExercises, exerciseId]);
    } catch (error) {
      console.error("Error marking exercise as complete:", error);
    }
  };

  if (!routine)
    return <div className="text-center mt-8">Loading routine...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Today's Routine</h1>
      <ul className="space-y-4">
        {routine.exercises.map((exercise) => (
          <li
            key={exercise.id}
            className="bg-white shadow overflow-hidden sm:rounded-md"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {exercise.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {exercise.sets} sets of {exercise.reps} reps
                  </p>
                </div>
                {!completedExercises.includes(exercise.id) && (
                  <button
                    onClick={() => handleExerciseComplete(exercise.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoutineTracker;
