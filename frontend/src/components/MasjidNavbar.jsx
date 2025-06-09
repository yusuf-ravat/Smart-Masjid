import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MasjidProfile from "./MasjidProfile";
import {getMasjidData} from "../utils/storageHelper";

const MasjidNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { masjidId, masjidtoken } = getMasjidData(); // Call getAdminData here

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/masjid");
  };

  const showToast = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`); // Replace with a toast component if needed
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/masjid/dashboard")}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-amber-400 relative"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Smart Masjid
                </h1>
                <p className="text-xs text-amber-200">Management System</p>
              </div>
            </div>
          </div>
          <button
            className="sm:hidden text-white text-2xl focus:outline-none transform transition-transform duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          <nav className="hidden sm:flex items-center gap-6">
            <NavLink label="Manage Users" to="/manageuser" />
            <NavLink label="View Donations" to="/view-donations" />
            <NavLink label="Events" to="/events" />
            <NavLink label="Prayer Times" to="/prayer-times" />
            <NavLink label="Volunteers" to="/volunteers" />
            <NavLink label="Settings" to="/settings" />
            <button
              className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
              onClick={() => setShowProfileModal(true)}
            >
              Profile
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-slate-950/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
              <NavLink label="Manage Users" to="/manageuser" onClick={toggleMenu} />
              <NavLink label="View Donations" to="/view-donations" onClick={toggleMenu} />
              <NavLink label="Send Alerts" to="/send-alerts" onClick={toggleMenu} />
              <NavLink label="Prayer Times" to="/prayer-times" onClick={toggleMenu} />
              <NavLink label="Volunteers" to="/volunteers" onClick={toggleMenu} />
              <NavLink label="Settings" to="/settings" onClick={toggleMenu} />
              <button
                className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setShowProfileModal(true);
                  toggleMenu();
                }}
              >
                Profile
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
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
        <MasjidProfile
        masjidId={masjidId}
        masjidtoken={masjidtoken}
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
      className="text-amber-100 hover:text-amber-300 font-medium transition-all duration-300"
      onClick={() => {
        if (to) navigate(to);
        if (onClick) onClick();
      }}
    >
      {label}
    </button>
  );
};

export default MasjidNavbar;