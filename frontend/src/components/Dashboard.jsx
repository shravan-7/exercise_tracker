import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { FaDumbbell, FaPlus, FaArrowRight } from "react-icons/fa";

function Dashboard() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routines:", error);
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const handleViewDetails = (routineId) => {
    history.push(`/routine/${routineId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Your Exercise Routines
      </h1>
      {routines.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {routine.name}
                  </h3>
                  <FaDumbbell className="text-blue-500 text-2xl" />
                </div>
                <p className="text-gray-600">
                  {routine.exercises.length} exercises
                </p>
                <button
                  onClick={() => handleViewDetails(routine.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
                >
                  View Details
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600 text-center">
          You don't have any routines yet.
        </p>
      )}
      <div className="mt-12 text-center">
        <Link
          to="/create-routine"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <FaPlus className="mr-2" />
          Create New Routine
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
