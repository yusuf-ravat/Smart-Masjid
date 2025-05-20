import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import { clearUserData, getUserData } from "../utils/storageHelper"; // Adjust the import path as needed
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { toast, showToast } = useToast();
  const { userId, userToken } = getUserData();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    clearUserData(); // Clear user data from local storage
    showToast("Logged out successfully", "success");
    navigate("/user"); // Redirect to login page
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-xl sticky top-0 z-50">
        <Toast message={toast.message} type={toast.type} show={toast.show} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/user/dashboard")}
          >
            <span className="text-3xl">🕌</span>
            <h1 className="text-2xl font-bold text-white">Smart Masjid</h1>
          </div>
          <button
            className="sm:hidden text-white text-2xl focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          <nav className="hidden sm:flex items-center gap-8">
          <NavLink label="Join Masjid" to="/user/masjidJoin" /> 
            <NavLink label="Prayer Times" to="/prayer-times" />
            <NavLink label="Events" to="/events" />
            <NavLink label="Requests" to="/requests" />
            <NavLink label="Donate" to="/donate" />
            <button
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
              onClick={() => setShowProfileModal(true)}
            >
              Profile
            </button>
            <button
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
              <NavLink label="Prayer Times" to="/prayer-times" onClick={toggleMenu} />
              <NavLink label="Events" to="/events" onClick={toggleMenu} />
              <NavLink label="Requests" to="/requests" onClick={toggleMenu} />
              <NavLink label="Donate" to="/donate" onClick={toggleMenu} />
              <NavLink label="Join Masjid" to="/join-masjid" onClick={toggleMenu} />
              <button
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                onClick={() => {
                  setShowProfileModal(true);
                  toggleMenu();
                }}
              >
                Profile
              </button>
              <button
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <UserProfile
          adminId={userId}
          admintoken={userToken}
          onClose={() => setShowProfileModal(false)}
          showToast={showToast}
        />
      )}
    </>
  );
};

const NavLink = ({ label, to, onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      className="text-white/90 hover:text-white font-medium transition-all duration-300"
      onClick={() => {
        if (to) navigate(to);
        if (onClick) onClick();
      }}
    >
      {label}
    </button>
  );
};

export default UserNavbar;