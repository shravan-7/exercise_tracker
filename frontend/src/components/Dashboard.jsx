import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

function Dashboard() {
  const [routines, setRoutines] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/routines/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        setRoutines(response.data);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, []);

  const handleViewDetails = (routineId) => {
    history.push(`/routine/${routineId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Your Exercise Routines
      </h1>
      {routines.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <li
              key={routine.id}
              className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">
                      {routine.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">
                    {routine.exercises.length} exercises
                  </p>
                </div>
                <Link
                  to={`/routine/${routine.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You don't have any routines yet.</p>
      )}
      <div className="mt-8">
        <Link
          to="/create-routine"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Create New Routine
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
