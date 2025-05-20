import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import UserNavbar from "../components/UserNavbar";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { getUserData } from "../utils/storageHelper";

const JoinMasjid = () => {
  const navigate = useNavigate();
  const [approvedMasjids, setApprovedMasjids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { toast, showToast } = useToast();
  const { userToken, userId } = getUserData();

  useEffect(() => {
    const fetchApprovedMasjids = async () => {
      try {
        const res = await axios.get("/auth/getApprovedMasjids");
        setApprovedMasjids(res.data);
      } catch (err) {
        showToast("Failed to fetch masjids.", "error");
      }
    };

    fetchApprovedMasjids();
  }, [showToast]);

  const filteredMasjids = approvedMasjids.filter(
    (masjid) =>
      (masjid.masjidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        masjid.masjidLocation.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "All" || masjid.masjidType === filterType)
  );

  const handleMasjidJoin = async (masjid) => {
    if (!userToken) {
      showToast("You must be logged in to join a masjid.", "error");
      return;
    }
    try {
      //masjidController.js
      const res = await axios.post(
        "/auth/userMasjidJoin",
        { userId, masjidId: masjid._id },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      showToast(res.data.message, "success");
      setTimeout(() => navigate("/user/dashboard"), 1000);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to join the masjid.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <UserNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Hero Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Join Your Local Masjid
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Connect with your community, participate in prayers, and stay updated with events and announcements
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="jama">Jama</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Masjid Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMasjids.length > 0 ? (
              filteredMasjids.map((masjid, idx) => (
                <div
                  key={idx}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {masjid.masjidName}
                      </h3>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                        {masjid.masjidType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>Handle By {masjid.name}</span>  
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{masjid.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{masjid.masjidLocation}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMasjidJoin(masjid)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 rounded-xl hover:from-indigo-700 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Join Masjid
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Masjids Found</h3>
                <p className="text-slate-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Join a Masjid?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    <path d="M12 22v-6"/>
                    <path d="M12 16v-4"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Spiritual Growth</h3>
                <p className="text-slate-600">
                  Participate in prayers, Quran studies, and lectures to deepen your faith.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Community</h3>
                <p className="text-slate-600">
                  Build lasting connections with fellow members through events and activities.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M12 7v2"/>
                    <path d="M12 11h.01"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Stay Informed</h3>
                <p className="text-slate-600">
                  Get updates on prayers, events, and alerts directly from your masjid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinMasjid;