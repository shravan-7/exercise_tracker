import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaVenusMars, FaCamera } from "react-icons/fa";

function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    gender: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user-profile/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      setUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        name: response.data.name,
        gender: response.data.gender,
      });
      setPreviewUrl(response.data.profile_picture);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      const updatedData = new FormData();
      for (const key in formData) {
        updatedData.append(key, formData[key]);
      }
      if (profilePicture) {
        updatedData.append("profile_picture", profilePicture);
      }

      try {
        await axios.put(
          "http://localhost:8000/api/update-profile/",
          updatedData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setSuccess("Profile updated successfully!");
        fetchUserData();
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
      }
    },
    [formData, profilePicture, token, fetchUserData],
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-48 h-48 rounded-full overflow-hidden mb-6 ring-4 ring-white shadow-lg"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={previewUrl || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <label
                htmlFor="profile_picture"
                className="absolute inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <FaCamera className="text-white text-3xl" />
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-indigo-200 mb-6">@{user.username}</p>
            <div className="w-full bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Profile Stats</h3>
              <div className="flex justify-between text-indigo-100">
                <span>Workouts: 42</span>
                <span>Friends: 108</span>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Your Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <div className="relative">
                    <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                  Update Profile
                </button>
              </motion.div>
            </form>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-green-600 bg-green-100 p-3 rounded-md"
              >
                {success}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
