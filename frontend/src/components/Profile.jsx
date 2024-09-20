import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile)
    return (
      <div className="text-center mt-8 text-gray-600">Loading profile...</div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold text-gray-700">Username:</span>{" "}
          <span className="text-gray-600">{profile.username}</span>
        </p>
        <p className="text-lg">
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          <span className="text-gray-600">{profile.email}</span>
        </p>
        <p className="text-lg">
          <span className="font-semibold text-gray-700">Joined:</span>{" "}
          <span className="text-gray-600">
            {new Date(profile.date_joined).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Profile;
