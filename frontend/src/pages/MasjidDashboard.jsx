import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasjidNavbar from "../components/MasjidNavbar";
import { getMasjidData } from "../utils/storageHelper";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import axios from "../api/axiosInstance";
import PrayerTiming from "../components/PrayerTiming";

const MasjidDashboard = () => {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const announcementsPerPage = 2;
  const navigate = useNavigate();
  const { masjidId, masjidtoken } = getMasjidData();
  const { toast, showToast } = useToast();

  const announcementCategories = [
    { 
      id: "general", 
      name: "General", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    { 
      id: "prayer", 
      name: "Prayer Times", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "event", 
      name: "Events", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: "donation", 
      name: "Donations", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "education", 
      name: "Education", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    { 
      id: "emergency", 
      name: "Emergency", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!masjidtoken || !masjidId) {
       navigate("/masjid");
        return;
      }
      try {
        const res = await axios.get(`/auth/getMasjidAnnouncements/${masjidId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        showToast("Failed to fetch announcements.", "error");
      }
    };

    fetchData();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [masjidtoken, masjidId, navigate, showToast]);

  // Fetch total users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await axios.get(`/auth/getMasjidUsers/${masjidId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        setTotalUsers(res.data.length);
      } catch (err) {
        showToast("Failed to fetch user count.", "error");
      }
    };

    fetchTotalUsers();
  }, [masjidId, masjidtoken, showToast]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      showToast("Announcement content cannot be empty.", "error");
      return;
    }
    try {
      const res = await axios.post(
        "/auth/postAnnouncement",
        { 
          masjidId, 
          content: announcement,
          category: selectedCategory 
        },
        { headers: { Authorization: `Bearer ${masjidtoken}` } }
      );
      showToast(res.data.message, "success");
      setAnnouncement("");
      setSelectedCategory("general");
      // Refresh announcements list
      const updatedRes = await axios.get(`/auth/getMasjidAnnouncements/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      setAnnouncements(updatedRes.data.announcements || []);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to post announcement.", "error");
    }
  };

  const handleEditAnnouncement = async (id) => {
    try {
      const res = await axios.put(
        `/auth/updateAnnouncement/${id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${masjidtoken}` } }
      );
      showToast(res.data.message, "success");
      setEditingId(null);
      setEditContent("");
      // Refresh announcements list
      const updatedRes = await axios.get(`/auth/getMasjidAnnouncements/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      setAnnouncements(updatedRes.data.announcements || []);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update announcement.", "error");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const res = await axios.delete(`/auth/deleteAnnouncement/${id}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        showToast(res.data.message, "success");
        // Refresh announcements list
        const updatedRes = await axios.get(`/auth/getMasjidAnnouncements/${masjidId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        setAnnouncements(updatedRes.data.announcements || []);
      } catch (err) {
        showToast(err.response?.data?.error || "Failed to delete announcement.", "error");
      }
    }
  };

  // Calculate pagination with sorted and filtered announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const announcementDate = new Date(announcement.date).toDateString();
    return announcementDate === selectedDate.toDateString();
  });
  
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => new Date(b.date) - new Date(a.date));
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = sortedAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <MasjidNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Welcome Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Welcome, Admin!
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl mx-auto">
            Manage your masjid's announcements, users, and more.
          </p>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="py-8 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{totalUsers}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Active Members
                </span>
              </div>
            </div>

            {/* Total Donations Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Total Donations</p>
                  <h3 className="text-2xl font-bold text-white mt-2">$45,678</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +8% from last month
                </span>
              </div>
            </div>

            {/* Upcoming Events Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Upcoming Events</p>
                  <h3 className="text-2xl font-bold text-white mt-2">5</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-sm text-amber-200 hover:text-amber-300 transition-colors duration-200">
                  View Schedule →
                </button>
              </div>
            </div>

            {/* Prayer Times Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Next Prayer</p>
                  <h3 className="text-2xl font-bold text-white mt-2">Asr</h3>
                  <p className="text-amber-200 text-sm mt-1">03:45 PM</p>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-sm text-amber-200 hover:text-amber-300 transition-colors duration-200">
                  View All Times →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrayerTiming />
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Post New Announcement */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-white mb-6">Post New Announcement</h2>
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {announcementCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : "bg-teal-900/50 border-teal-600 text-amber-200 hover:bg-teal-900/70"
                      }`}
                    >
                      <span className="text-amber-400">{category.icon}</span>
                      <span className="text-xs font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={`Write your ${announcementCategories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()} announcement here...`}
                  rows="4"
                ></textarea>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200 text-sm">
                    Category: {announcementCategories.find(cat => cat.id === selectedCategory)?.name}
                  </span>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
                  >
                    Post Announcement
                  </button>
                </div>
              </form>
            </div>

            {/* Announcements List */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Announcements</h2>
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-teal-900/50 rounded-lg px-3 py-2 border border-teal-600 hover:border-amber-500 transition-colors duration-200 w-full sm:w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="bg-transparent text-white focus:outline-none cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-teal-700 scrollbar-rounded">
                {currentAnnouncements.length > 0 ? (
                  currentAnnouncements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className="bg-teal-900/50 rounded-lg p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      {editingId === announcement._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 bg-teal-800/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            rows="3"
                          ></textarea>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAnnouncement(announcement._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all duration-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditContent("");
                              }}
                              className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-400">
                              {announcementCategories.find(cat => cat.id === announcement.category)?.icon || announcementCategories[0].icon}
                            </span>
                            <span className="text-amber-200 text-sm font-medium">
                              {announcementCategories.find(cat => cat.id === announcement.category)?.name || "General"}
                            </span>
                          </div>
                          <p className="text-amber-100 mb-2">{announcement.content}</p>
                          <div className="flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(announcement.date).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-amber-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  {announcement.reactions?.likes || 0}
                                </span>
                                <span className="flex items-center gap-1 text-red-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                  </svg>
                                  {announcement.reactions?.dislikes || 0}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(announcement._id);
                                  setEditContent(announcement.content);
                                }}
                                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(announcement._id)}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-amber-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-amber-200">No announcements for the selected date.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredAnnouncements.length > announcementsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Previous
                  </button>
                  <span className="text-amber-200">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Quick Links</h2>
            <p className="text-amber-200 mt-2">Access key features to manage your masjid.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Manage Users" link="/manageuser" icon="👥" />
            <Card title="View Donations" link="/view-donations" icon="💰" />
            <Card title="Send Alerts" link="/send-alerts" icon="📢" />
            <Card title="Prayer Times" link="/prayer-times" icon="🕋" />
            <Card title="Volunteers" link="/volunteers" icon="🙋" />
            <Card title="Settings" link="/settings" icon="⚙️" />
          </div>
        </div>
      </section>
    </div>
  );
};

const Card = ({ title, link, icon }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-amber-500/20 cursor-pointer"
      onClick={() => navigate(link)}
    >
      <div className="flex items-center gap-3">
        <div className="bg-teal-600/20 p-3 rounded-full">
          {title === "Manage Users" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
          {title === "View Donations" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {title === "Send Alerts" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )}
          {title === "Prayer Times" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {title === "Volunteers" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
          {title === "Settings" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-sm text-amber-200">Click to manage</span>
        </div>
      </div>
    </div>
  );
};

export default MasjidDashboard;