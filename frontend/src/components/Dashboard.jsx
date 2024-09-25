import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Changed from useHistory
import {
  FaDumbbell,
  FaPlus,
  FaArrowRight,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { showToast } from "./CustomToast";

function Dashboard() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const navigate = useNavigate(); // Changed from useHistory

  const fetchRoutines = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/routines/`,
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
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleViewDetails = useCallback(
    (routineId) => {
      navigate(`/routine/${routineId}`); // Changed from history.push
    },
    [navigate],
  );

  const openDeleteModal = useCallback((routine) => {
    setRoutineToDelete(routine);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setRoutineToDelete(null);
  }, []);

  const handleDeleteRoutine = useCallback(async () => {
    if (routineToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_REACT_URL}/api/routines/${routineToDelete.id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        setRoutines((prevRoutines) =>
          prevRoutines.filter((routine) => routine.id !== routineToDelete.id),
        );
        showToast("Routine deleted successfully", "success");
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting routine:", error);
        showToast("Failed to delete routine", "error");
      }
    }
  }, [routineToDelete, closeDeleteModal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Your Exercise Routines
        </h1>
        <Link
          to="/create-routine"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <FaPlus className="mr-2" />
          Create New Routine
        </Link>
      </div>
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
                <div className="flex justify-between">
                  <button
                    onClick={() => handleViewDetails(routine.id)}
                    className="flex-1 mr-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    View Details
                    <FaArrowRight className="ml-2" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(routine)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600 text-center mt-12">
          You don't have any routines yet. Create a new routine to get started!
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationTriangle
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Routine
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the routine "
                        {routineToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteRoutine}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
