import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { getUserData } from "../utils/storageHelper";
import Toast from "./Toast";

const UserProfile = ({ onClose }) => {
  const { userId, userToken } = getUserData();
  const [toast, setToast] = useState({ message: "", type: "" });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "+"
  });

  // Fetch user profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/auth/getUserProfile/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const { name, email, mobileNumber } = res.data;
        setProfile({
          name: name || "",
          email: email || "",
          password: "",
          mobileNumber: mobileNumber || "+"
        });
      } catch (err) {
        setToast({ message: "Failed to fetch profile details.", type: "error" });
      }
    };

    if (userId && userToken) {
      fetchProfile();
    }
  }, [userId, userToken]);

  const validateMobileNumber = (number) => {
    return /^\+[1-9]\d{1,14}$/.test(number);
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateMobileNumber(profile.mobileNumber)) {
      setToast({ 
        message: "Please enter a valid mobile number with country code (e.g., +1234567890)", 
        type: "error" 
      });
      return;
    }

    try {
      const res = await axios.put(
        `/auth/updateUserProfile/${userId}`,
        {
          name: profile.name,
          email: profile.email,
          password: profile.password,
          mobileNumber: profile.mobileNumber
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setToast({ message: res.data.message || "Profile updated successfully.", type: "success" });
      onClose();
    } catch (err) {
      setToast({ 
        message: err.response?.data?.error || "Failed to update profile.", 
        type: "error" 
      });
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value.startsWith("+") ? e.target.value : "+" + e.target.value;
    setProfile({ ...profile, mobileNumber: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-2xl border border-white/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">User Profile</h3>
            <p className="text-sm text-slate-500">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-slate-700 text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  name="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-slate-700 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  name="email"
                  value={profile.email}
                  type="email"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-slate-700 text-sm font-medium mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  name="mobileNumber"
                  value={profile.mobileNumber}
                  onChange={handleMobileNumberChange}
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1234567890"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && profile.mobileNumber === "+") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-slate-700 text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  name="password"
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  type="password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 font-medium transform hover:scale-105"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;