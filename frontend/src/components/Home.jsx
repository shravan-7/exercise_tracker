import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../Home.css";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsVisible(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-4xl w-full space-y-8 text-center ${isVisible ? "animate-fadeIn" : "opacity-0"}`}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-2 animate-float">
          Exercise Tracker
        </h1>
        <p className="text-xl sm:text-2xl text-blue-200 mb-12 animate-float animation-delay-300">
          Elevate Your Fitness Journey
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-float animation-delay-600">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full animate-fadeIn animation-delay-900">
        {[
          {
            icon: "📊",
            title: "Track Progress",
            description: "Monitor your fitness journey with detailed analytics",
          },
          {
            icon: "🏋️‍♂️",
            title: "Custom Workouts",
            description: "Create personalized routines tailored to your goals",
          },
          {
            icon: "🏆",
            title: "Set Goals",
            description: "Define and achieve your fitness milestones",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl animate-float animation-delay-1200"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-blue-200">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
