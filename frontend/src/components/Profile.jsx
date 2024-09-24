import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-lg">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={previewUrl || "https://via.placeholder.com/150"}
                alt="Profile"
              />
            </div>
            <label
              htmlFor="profile_picture"
              className="cursor-pointer bg-white text-indigo-600 py-2 px-4 rounded-full font-semibold hover:bg-indigo-50 transition duration-300 ease-in-out"
            >
              Change Photo
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-8 flex-grow">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Your Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                  Update Profile
                </button>
              </div>
            </form>
            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">
                {success}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
