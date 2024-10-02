import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaVenusMars,
  FaCamera,
  FaLock,
  FaTrash,
  FaSignOutAlt,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showToast } from "./CustomToast";

function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isProfilePictureChanged, setIsProfilePictureChanged] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    gender: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-profile/`,
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

  const handlePasswordChange = useCallback((e) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsProfilePictureChanged(true);
  }, []);

  const handleSaveProfilePicture = useCallback(async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/update-profile/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setSuccess("Profile picture updated successfully!");
      setIsProfilePictureChanged(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setError("Failed to update profile picture. Please try again.");
    }
  }, [profilePicture, token, fetchUserData]);

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
          `${process.env.REACT_APP_API_URL}/update-profile/`,
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
        setActiveSection(null);
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
      }
    },
    [formData, profilePicture, token, fetchUserData],
  );

  const handlePasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/change-password/`,
          {
            current_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
          },
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        setSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setActiveSection(null);
      } catch (error) {
        console.error("Error changing password:", error);
        setError(
          "Failed to change password. Please check your current password and try again.",
        );
      }
    },
    [passwordData, token],
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-account/`, {
        headers: { Authorization: `Token ${token}` },
      });
      showToast("Your account has been deleted successfully.", "success");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    }
  }, [token, logout, navigate]);

  const handleLogout = useCallback(() => {
    logout(); // This is your existing logout function from useAuth
    navigate("/"); // Redirect to the home page
    showToast("You have been logged out successfully.", "success");
  }, [logout, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const menuItems = [
    { id: "edit", icon: FaEdit, label: "Edit Profile" },
    { id: "password", icon: FaLock, label: "Change Password" },
    { id: "delete", icon: FaTrash, label: "Delete Account" },
    { id: "logout", icon: FaSignOutAlt, label: "Logout", action: handleLogout },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col items-center justify-center">
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
            {isProfilePictureChanged && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfilePicture}
                className="flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md transition duration-300 ease-in-out mb-4"
              >
                <FaSave className="mr-2" />
                Save Picture
              </motion.button>
            )}
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
            <div className="grid grid-cols-2 gap-4 mb-8">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
                  onClick={() =>
                    item.action ? item.action() : setActiveSection(item.id)
                  }
                >
                  <item.icon className="mr-2" />
                  {item.label}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeSection === "edit" && (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
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
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
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
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
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
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
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
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  >
                    Update Profile
                  </motion.button>
                </motion.form>
              )}

              {activeSection === "password" && (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <label
                      htmlFor="confirmNewPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                      Change Password
                    </button>
                  </motion.div>
                </motion.form>
              )}
              {activeSection === "delete" && (
                <motion.div
                  key="delete-confirm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-red-600 mb-4">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
                  >
                    Confirm Delete Account
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

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

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">Confirm Account Deletion</h3>
            <p className="mb-6">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Profile;
