import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "./CustomToast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaVenusMars,
  FaDumbbell,
  FaChartLine,
  FaEye,
  FaEyeSlash,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register/`,
        formData,
      );
      login(response.data.token);
      showToast(
        `Welcome, ${response.data.username}! Your account has been created.`,
        "success",
      );
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors.join("\n"));
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error.response?.data);
    }
  };

  const inputFields = [
    {
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      icon: <FaUser />,
      label: "Username",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      icon: <FaEnvelope />,
      label: "Email Address",
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Create a strong password",
      icon: <FaLock />,
      label: "Password",
    },
    {
      name: "confirm_password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Confirm your password",
      icon: <FaLock />,
      label: "Confirm Password",
    },
    {
      name: "name",
      type: "text",
      placeholder: "Enter your full name",
      icon: <FaUserCircle />,
      label: "Full Name",
    },
    {
      name: "gender",
      type: "select",
      placeholder: "Select your gender",
      icon: <FaVenusMars />,
      label: "Gender",
      options: [
        { value: "", label: "Select Gender" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Registration Form */}
          <div>
            <div className="text-center">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                Create your account
              </motion.h2>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 mb-4 text-sm text-gray-600"
              >
                Join our fitness community and start your journey to a healthier
                you!
              </motion.p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {inputFields.map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                          {field.icon}
                        </div>
                        {field.type === "select" ? (
                          <select
                            id={field.name}
                            name={field.name}
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-blue-400"
                            value={formData[field.name]}
                            onChange={handleChange}
                          >
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-blue-400"
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => {
                              if (field.name === "password")
                                setPasswordFocused(true);
                              if (field.name === "confirm_password")
                                setConfirmPasswordFocused(true);
                            }}
                            onBlur={() => {
                              if (field.name === "password")
                                setPasswordFocused(false);
                              if (field.name === "confirm_password")
                                setConfirmPasswordFocused(false);
                            }}
                          />
                        )}
                        {(field.name === "password" ||
                          field.name === "confirm_password") &&
                          (formData[field.name].length > 0 ||
                            (field.name === "password"
                              ? passwordFocused
                              : confirmPasswordFocused)) && (
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 focus:outline-none"
                              onClick={() => {
                                if (field.name === "password") {
                                  setShowPassword(!showPassword);
                                } else {
                                  setShowConfirmPassword(!showConfirmPassword);
                                }
                              }}
                            >
                              {field.name === "password" ? (
                                showPassword ? (
                                  <FaEyeSlash size={20} />
                                ) : (
                                  <FaEye size={20} />
                                )
                              ) : showConfirmPassword ? (
                                <FaEyeSlash size={20} />
                              ) : (
                                <FaEye size={20} />
                              )}
                            </button>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-6"
                >
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    Register
                  </button>
                </motion.div>
              </form>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-center text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center mt-4"
              >
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-300 ease-in-out"
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Description Row */}
          <div className="border-l pl-8 border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Why Join Our Fitness Community?
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-blue-100 p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <FaChartLine className="text-3xl text-blue-600 mr-3" />
                  <h4 className="font-bold text-blue-700 text-lg">
                    Track Progress
                  </h4>
                </div>
                <p className="text-blue-600">
                  Monitor your fitness journey with detailed analytics and
                  insights. Visualize your improvements over time and stay
                  motivated.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-green-100 p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <FaDumbbell className="text-3xl text-green-600 mr-3" />
                  <h4 className="font-bold text-green-700 text-lg">
                    Custom Workouts
                  </h4>
                </div>
                <p className="text-green-600">
                  Create and manage personalized routines tailored to your
                  goals. Design workouts that fit your schedule and preferences.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-yellow-100 p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <FaTrophy className="text-3xl text-yellow-600 mr-3" />
                  <h4 className="font-bold text-yellow-700 text-lg">
                    Set Goals
                  </h4>
                </div>
                <p className="text-yellow-600">
                  Define and achieve your fitness milestones with smart goal
                  tracking. Stay focused on your objectives and celebrate your
                  successes.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-red-100 p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-3xl text-red-600 mr-3" />
                  <h4 className="font-bold text-red-700 text-lg">
                    Schedule Workouts
                  </h4>
                </div>
                <p className="text-red-600">
                  Plan your exercise routine with an interactive calendar. Never
                  miss a workout and maintain consistency in your fitness
                  journey.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
