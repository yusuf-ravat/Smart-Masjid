import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMasjidData } from '../../utils/storageHelper';
import axios from '../../api/axiosInstance';

const WelcomeSection = ({ totalUsers }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { masjidId, masjidtoken } = getMasjidData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(`/events/getMasjidEvents/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      // Filter and sort upcoming events
      const upcoming = response.data
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  return (
    <>
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
                  <h3 className="text-2xl font-bold text-white mt-2">{upcomingEvents.length}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/masjid/events')}
                  className="text-sm text-amber-200 hover:text-amber-300 transition-colors duration-200"
                >
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
    </>
  );
};

export default WelcomeSection; 