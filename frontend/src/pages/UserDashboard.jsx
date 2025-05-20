import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { getUserData } from "../utils/storageHelper";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import axios from "../api/axiosInstance";
import UserPrayerTiming from "../components/UserPrayerTiming";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [masjidDetails, setMasjidDetails] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [donationForm, setDonationForm] = useState({
    amount: "",
    description: "",
    type: "Lillah", // Default donation type
    currency: "INR" // Default currency
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const announcementsPerPage = 4;
  const { userToken, userId, name } = getUserData();
  const [todayAnnouncements, setTodayAnnouncements] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const announcementCategories = [
    {
      id: "all",
      name: "All",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      id: "general",
      name: "General",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      id: "prayer",
      name: "Prayer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "event",
      name: "Events",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "donation",
      name: "Donations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "education",
      name: "Education",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchMasjidDetails = async () => {
      if (!userToken || !userId) {
        navigate("/user");
        return;
      }
      try {
        //get joined masjid details masjidController
        const res = await axios.get(`/auth/getJoinedMasjidDetails/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setMasjidDetails(res.data);
        setFetchError(false);

        // Fetch announcements for the user's joined masjid
        const announcementsRes = await axios.get(`/auth/getUserAnnouncements/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (announcementsRes.data) {
          setAnnouncements(announcementsRes.data.announcements || []);
        }
       
      } catch (err) {
        setFetchError(true);
        setMasjidDetails(null);
      }
    };

    fetchMasjidDetails();
  }, [userToken, userId, navigate]);

  useEffect(() => {
    // Update today's announcements count
    const today = new Date();
    const todayCount = announcements.filter(announcement => {
      const announcementDate = new Date(announcement.date);
      return (
        announcementDate.getDate() === today.getDate() &&
        announcementDate.getMonth() === today.getMonth() &&
        announcementDate.getFullYear() === today.getFullYear()
      );
    }).length;
    setTodayAnnouncements(todayCount);
  }, [announcements]);

  // Handle donation submission
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donationForm.amount || isNaN(donationForm.amount) || donationForm.amount <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }
    try {
      const res = await axios.post(
        "/auth/submitDonation",
        {
          userId,
          masjidId: masjidDetails?.masjidId,
          amount: parseFloat(donationForm.amount),
          description: donationForm.description,
          type: donationForm.type,
          currency: donationForm.currency
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      showToast(res.data.message || "Donation submitted successfully!", "success");
      setDonationForm({ amount: "", description: "", type: "Lillah", currency: "INR" });
      const updatedRes = await axios.get(`/auth/getJoinedMasjidDetails/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setMasjidDetails(updatedRes.data);
      setFetchError(false);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to submit donation.", "error");
    }
  };


  // Handle leave masjid
  const handleLeaveMasjid = async () => {
    try {
      await axios.post(
        "/auth/userMasjidLeave",
        { userId, masjidId: masjidDetails.masjidId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      localStorage.removeItem("joinedMasjid");
      setMasjidDetails(null);
      showToast("Left masjid successfully.", "success");
      navigate("/join-masjid");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to leave masjid.", "error");
    }
  };


  // Mock events if not provided
  const events = masjidDetails?.events || [
    { id: "1", title: "Community Iftar", date: "2025-05-03", time: "6:30 PM", location: "Masjid Hall" },
    { id: "2", title: "Quran Study Circle", date: "2025-05-05", time: "7:00 PM", location: "Library" },
  ];

  // Update the filteredAnnouncements to include category filter
  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const announcementDate = new Date(announcement.date);
      const selectedDateObj = new Date(selectedDate);
      const dateMatch =
        announcementDate.getDate() === selectedDateObj.getDate() &&
        announcementDate.getMonth() === selectedDateObj.getMonth() &&
        announcementDate.getFullYear() === selectedDateObj.getFullYear();

      const categoryMatch = selectedCategory === "all" || announcement.category === selectedCategory;

      return dateMatch && categoryMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (announcementPage - 1) * announcementsPerPage,
    announcementPage * announcementsPerPage
  );
  const totalAnnouncementPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  const handleReaction = async (announcementId, reaction) => {
    try {
      const res = await axios.post(
        "/auth/reactToAnnouncement",
        { announcementId, userId, reaction },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // Update local state with the updated announcement
      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            reactions: res.data.announcement.reactions,
            userReactions: res.data.announcement.userReactions
          };
        }
        return announcement;
      }));

      showToast("Reaction updated successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update reaction", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <UserNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Welcome Section with Glassmorphism Effect */}
      <section className="py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-center lg:text-left w-full lg:w-auto">
                <div className="relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
                  <div className="pl-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 tracking-wide uppercase">
                      {masjidDetails?.masjidName?.toUpperCase() || "WELCOME TO SMART MASJID"}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm sm:text-base">{masjidDetails?.masjidLocation || "Join a masjid to get started"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 bg-white/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm w-full lg:w-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                  {name ? name[0]?.toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Welcome, {name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid with Hover Effects */}
            <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100 transform hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base text-slate-700 font-medium">Announcements</h3>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{todayAnnouncements}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">Today's updates</p>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-100 transform hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-slate-700 font-medium">Events</h3>
                    <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Upcoming events</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-100 transform hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0 1 1 0 002 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-slate-700 font-medium">Prayer Times</h3>
                    <p className="text-2xl font-bold text-slate-900">5</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Daily prayers</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 border border-rose-100 transform hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-slate-700 font-medium">Donations</h3>
                    <p className="text-2xl font-bold text-slate-900">3</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">This month</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => {
                  document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Make a Donation
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      {masjidDetails && (
        <section className="py-4 sm:py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <UserPrayerTiming />
          </div>
        </section>
      )}

      {/* Joined Masjid Details Section */}
      {masjidDetails ? (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Third Section: Announcements */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Announcements</h3>
                      <p className="text-sm text-slate-500">Stay updated with latest news</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="appearance-none bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {filteredAnnouncements.length} Updates
                    </div>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {announcementCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${selectedCategory === category.id
                          ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <span className="text-indigo-500">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Announcements List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedAnnouncements.length > 0 ? (
                    paginatedAnnouncements.map((announcement, idx) => (
                      <div
                        key={idx}
                        className="bg-indigo-50 rounded-xl p-4 border border-indigo-50 hover:bg-indigo-50/30 transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Decorative Accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      

                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {announcement.adminName?.[0]?.toUpperCase() || 'A'}
                          </div>
                       
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-indigo-600 border border-indigo-100">
                                {announcementCategories.find(cat => cat.id === announcement.category)?.icon}
                                {announcementCategories.find(cat => cat.id === announcement.category)?.name || 'General'}
                                  {/* Announcement Number */}

                              </span>
                              
                              <span className="text-xs text-slate-600 bg-indigo-100/50 px-2.5 py-1 rounded-full font-medium">
                                {new Date(announcement.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="absolute top-2 right-2 text-indigo-600 rounded-full text-xs font-medium">
                          #{((announcementPage - 1) * announcementsPerPage) + idx + 1}
                        </span>
                            </div>
                            
                            <p className="text-sm text-slate-800 leading-relaxed font-medium">{announcement.content}</p>
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                onClick={() => handleReaction(announcement._id, 'like')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${announcement.userReactions?.some(r => r.userId === userId && r.reaction === 'like')
                                    ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
                                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-200 hover:text-indigo-800'
                                  }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                                {announcement.reactions?.likes || 0}
                              </button>
                              <button
                                onClick={() => handleReaction(announcement._id, 'dislike')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${announcement.userReactions?.some(r => r.userId === userId && r.reaction === 'dislike')
                                    ? 'bg-rose-200 text-rose-800 hover:bg-rose-300'
                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-200 hover:text-rose-800'
                                  }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                                </svg>
                                {announcement.reactions?.dislikes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 text-center py-10 bg-white rounded-xl border border-indigo-50">
                      <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100/50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">No Announcements Found</h4>
                      <p className="text-sm text-slate-600 max-w-sm mx-auto">No announcements match your selected date or category. Try different filters or check back later.</p>
                    </div>
                  )}
                </div>
                {/* Pagination */}
                {filteredAnnouncements.length > 0 && (
                  <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                      onClick={() => setAnnouncementPage(prev => Math.max(1, prev - 1))}
                      disabled={announcementPage === 1}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    <span className="text-indigo-600 font-medium">
                      Page {announcementPage} of {totalAnnouncementPages}
                    </span>
                    <button
                      onClick={() => setAnnouncementPage(prev => Math.min(totalAnnouncementPages, prev + 1))}
                      disabled={announcementPage === totalAnnouncementPages}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Fourth Section: Event Highlights */}
            <div className="mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Event Highlights</h3>
                      <p className="text-sm text-slate-500">Upcoming community events</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all duration-300 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    View All Events
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden"
                    >
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                      <div className="absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Event Content */}
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {event.location}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                              {event.date}
                            </span>
                            <span className="mt-1 text-sm text-slate-600">
                              {event.time}
                            </span>
                          </div>
                        </div>

                        {/* Event Description */}
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                          Join us for this special community event. All members are welcome to participate and contribute.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                            onClick={() => alert("Event joining not implemented yet.")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Join Event
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors duration-300"
                            onClick={() => alert("Share event not implemented yet.")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fifth Section: Make a Donation */}
            <div id="donation-section" className="mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Make a Donation</h3>
                      <p className="text-sm text-slate-500">Support your community</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
                  <form onSubmit={handleDonationSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 text-sm font-medium mb-2">Amount</label>
                        <div className="flex gap-3">
                          <select
                            value={donationForm.currency}
                            onChange={(e) => setDonationForm({ ...donationForm, currency: e.target.value })}
                            className="w-30 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="INR">₹ Rupee</option>
                            <option value="USD">$ Dollar</option>
                            <option value="GBP">£ Pound</option>
                            <option value="EUR">€ Euro</option>
                            <option value="AED">د.إ Dirham</option>
                          </select>
                          <input
                            type="number"
                            value={donationForm.amount}
                            onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                            className="flex-1 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            placeholder="Enter amount"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 text-sm font-medium mb-2">Donation Type</label>
                        <select
                          value={donationForm.type}
                          onChange={(e) => setDonationForm({ ...donationForm, type: e.target.value })}
                          className="w-full px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                          <option value="Zakat">Zakat</option>
                          <option value="Lillah">Lillah</option>
                          <option value="Sadqa">Sadqa</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-medium mb-2">Description (Optional)</label>
                      <input
                        type="text"
                        value={donationForm.description}
                        onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Purpose of donation"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 text-sm font-medium"
                      >
                        Submit Donation
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDonationHistory(!showDonationHistory)}
                        className="w-full sm:w-auto text-indigo-600 hover:text-indigo-700 text-sm font-medium bg-indigo-50 px-6 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-300"
                      >
                        {showDonationHistory ? "Hide History" : "View History"}
                      </button>
                    </div>
                  </form>

                  {showDonationHistory && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-4">Donation History</h4>
                      <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-100">
                        {masjidDetails?.donations?.length > 0 ? (
                          masjidDetails.donations.map((donation, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg">
                              <div>
                                <span className="font-medium">
                                  {donation.currency === "INR" ? "₹" :
                                    donation.currency === "USD" ? "$" :
                                      donation.currency === "GBP" ? "£" :
                                        donation.currency === "EUR" ? "€" :
                                          donation.currency === "AED" ? "د.إ" : ""}{donation.amount}
                                </span>
                                <span className="text-slate-500 ml-2">{donation.type}</span>
                              </div>
                              <span className="text-slate-500 text-xs">
                                {new Date(donation.date).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-sm text-center py-4">No donation history available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sixth Section: Quick Links */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Quick Links</h3>
                  <p className="text-sm text-slate-500">Quick access to important features</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <button
                  className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium"
                  onClick={() => alert("Contact admin not implemented yet.")}
                >
                  Contact Admin
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium"
                  onClick={() => alert("View calendar not implemented yet.")}
                >
                  View Calendar
                </button>
                <button
                  className="bg-rose-600 text-white px-4 py-3 rounded-lg hover:bg-rose-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium"
                  onClick={handleLeaveMasjid}
                >
                  Leave Masjid
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">
              {fetchError ? "No data available." : "You have not joined any masjid yet."}
            </h2>
            <p className="text-slate-600 mt-2">
              {fetchError
                ? "We couldn't fetch your masjid details. Please try again later."
                : "Join a masjid to see events, announcements, and more."}
            </p>
            <button
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium"
              onClick={() => navigate("/user/masjidJoin")}
            >
              Join a Masjid
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default UserDashboard;
