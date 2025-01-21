"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user data based on userId from localStorage
  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("You are not logged in. Please log in first.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (response.status === 200) {
        setUser(response.data.user);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (err) {
      setError("Failed to load user data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-200 min-h-screen py-12">
      <ToastContainer />
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Profile Container */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-gray-900">Your Profile</h2>
            <p className="text-lg text-gray-600 mt-2">Welcome back, {user.fullname.firstname}!</p>
          </div>

          <div className="flex justify-center items-center space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl">
              <img
                src={`https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start space-y-4">
              <div className="text-xl font-semibold text-gray-800">Name:</div>
              <div className="text-lg text-gray-600">
                {user.fullname.firstname} {user.fullname.lastname}
              </div>

              <div className="text-xl font-semibold text-gray-800">Email:</div>
              <div className="text-lg text-gray-600">{user.email}</div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-center">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
              onClick={() => router.push("/profile/edit")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


