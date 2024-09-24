import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaVenusMars,
  FaDumbbell,
  FaChartLine,
  FaUsers,
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
        "http://localhost:8000/api/register/",
        formData,
      );
      login(response.data.token);
      toast.success(
        `Welcome, ${response.data.username}! Your account has been created.`,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.error || "Registration failed. Please try again.",
      );
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
      type: "password",
      placeholder: "Create a strong password",
      icon: <FaLock />,
      label: "Password",
    },
    {
      name: "confirm_password",
      type: "password",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Registration Form */}
          <div>
            <div className="text-center">
              <motion.h2
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Create your account
              </motion.h2>
              <p className="mt-2 text-sm text-gray-600">
                Join our fitness community and start your journey to a healthier
                you!
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {inputFields.map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          {field.icon}
                        </div>
                        {field.type === "select" ? (
                          <select
                            id={field.name}
                            name={field.name}
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-purple-400"
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
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-purple-400"
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6"
                >
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
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
                transition={{ delay: 0.5 }}
                className="text-center mt-4"
              >
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-purple-600 hover:text-purple-500 transition duration-300 ease-in-out"
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
                className="bg-purple-100 p-4 rounded-lg"
              >
                <FaDumbbell className="text-2xl text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-700 mb-1">
                  Track Workouts
                </h4>
                <p className="text-sm text-purple-600">
                  Log your exercises and monitor your progress over time.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-blue-100 p-4 rounded-lg"
              >
                <FaChartLine className="text-2xl text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-700 mb-1">
                  Progress Insights
                </h4>
                <p className="text-sm text-blue-600">
                  Gain insights into your fitness journey and stay motivated.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-pink-100 p-4 rounded-lg"
              >
                <FaUsers className="text-2xl text-pink-600 mb-2" />
                <h4 className="font-semibold text-pink-700 mb-1">
                  Join the Community
                </h4>
                <p className="text-sm text-pink-600">
                  Be a part of a supportive community with like-minded fitness
                  enthusiasts.
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
