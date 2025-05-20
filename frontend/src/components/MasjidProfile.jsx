import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
//import {getMasjidData} from "../utils/storageHelper";
const MasjidProfile = ({ masjidId, masjidtoken, onClose, showToast }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNumber: "",   
    masjidName: "",
    masjidLocation: "",
    masjidId: "",
    masjidType: "",
    password: "",
  });

  const [bankingDetails, setBankingDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    upiId: "",
    isBankingEnabled: false,
  });

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {  
      try {
        const res = await axios.get(`/auth/getMasjidProfile/${masjidId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` },
        });
        const {
          name,
          email,
          mobileNumber,
          masjidName,
          masjidLocation,
          masjidIdSaas,
          masjidType,
          bankingDetails: bankDetails,
        } = res.data;
        setProfile({
          name: name || "",
          email: email || "",
          mobileNumber: mobileNumber || "",
          masjidName: masjidName || "",
          masjidLocation: masjidLocation || "",
          masjidIdSaas: masjidIdSaas || "",
          masjidType: masjidType || "",
          password: "",
        });
        if (bankDetails) {
          setBankingDetails({
            accountHolderName: bankDetails.accountHolderName || "",
            accountNumber: bankDetails.accountNumber || "",
            bankName: bankDetails.bankName || "",
            ifscCode: bankDetails.ifscCode || "",
            branchName: bankDetails.branchName || "",
            upiId: bankDetails.upiId || "",
            isBankingEnabled: bankDetails.isBankingEnabled || false,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("Failed to fetch profile details.", "error");
      }
    };

    if (masjidId && masjidtoken) {
      fetchProfile();
    }
  }, [masjidId, masjidtoken, showToast]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/auth/updateMasjidProfile/${masjidId}`,
        {
          name: profile.name,
          email: profile.email,
          mobileNumber: profile.mobileNumber,
          masjidName: profile.masjidName,
          masjidLocation: profile.masjidLocation,
          masjidType: profile.masjidType,
          password: profile.password,
          bankingDetails,
        },
        { headers: { Authorization: `Bearer ${masjidtoken}` } }
      );

      showToast(res.data.message || "Profile updated successfully.", "success");
      onClose(); // Close the modal after successful update
    } catch (err) {
      showToast("Failed to update profile.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-teal-900 to-teal-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-6xl border border-amber-500/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Admin Masjid Profile</h3>
            <p className="text-amber-200/80 text-sm mt-1">Manage your profile and banking details</p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 transition-colors duration-200 mt-2 sm:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8 border-b border-teal-600/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 sm:px-6 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-amber-200 hover:text-amber-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("banking")}
            className={`pb-3 px-4 sm:px-6 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "banking"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-amber-200 hover:text-amber-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Banking Details</span>
          </button>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
          {activeTab === "profile" ? (
            <div className="bg-teal-900/30 rounded-xl p-4 sm:p-6 border border-teal-600/30">
              <h4 className="text-lg font-semibold text-amber-200 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Name</label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    type="email"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Mobile Number</label>
                  <input
                    name="mobileNumber"
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    type="tel"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">New Password</label>
                  <input
                    name="password"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    type="password"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="New Password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Masjid Name</label>
                  <input
                    name="masjidName"
                    value={profile.masjidName}
                    onChange={(e) => setProfile({ ...profile, masjidName: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Masjid Location</label>
                  <input
                    name="masjidLocation"
                    value={profile.masjidLocation}
                    onChange={(e) => setProfile({ ...profile, masjidLocation: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Masjid Type</label>
                  <select
                    name="masjidType"
                    value={profile.masjidType}
                    onChange={(e) => setProfile({ ...profile, masjidType: e.target.value })}
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="jama">Jama</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-teal-900/30 rounded-xl p-4 sm:p-6 border border-teal-600/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-lg font-semibold text-amber-200 mb-2 sm:mb-0">Banking Information</h4>
                <label className="flex items-center space-x-2 text-amber-200 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={bankingDetails.isBankingEnabled}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, isBankingEnabled: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-amber-500 rounded border-teal-600 focus:ring-amber-500"
                  />
                  <span>Enable Banking Details for Donations</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Account Holder Name</label>
                  <input
                    name="accountHolderName"
                    value={bankingDetails.accountHolderName}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, accountHolderName: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Account Number</label>
                  <input
                    name="accountNumber"
                    value={bankingDetails.accountNumber}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, accountNumber: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Bank Name</label>
                  <input
                    name="bankName"
                    value={bankingDetails.bankName}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, bankName: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">IFSC Code</label>
                  <input
                    name="ifscCode"
                    value={bankingDetails.ifscCode}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, ifscCode: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">Branch Name</label>
                  <input
                    name="branchName"
                    value={bankingDetails.branchName}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, branchName: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-amber-200 text-sm font-medium">UPI ID</label>
                  <input
                    name="upiId"
                    value={bankingDetails.upiId}
                    onChange={(e) => setBankingDetails({ ...bankingDetails, upiId: e.target.value })}
                    type="text"
                    className="w-full sm:w-64 px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasjidProfile;