import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { getMasjidData } from '../utils/storageHelper';
import useToast from '../hooks/useToast';

const PrayerTiming = () => {
  const [timings, setTimings] = useState({
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
    jummah: '',
    eidUlFitr: '',
    eidUlAdha: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasTimings, setHasTimings] = useState(false);
  const { masjidId, masjidtoken } = getMasjidData();
  const { showToast } = useToast();

  const getPrayerIcon = (prayer) => {
    switch (prayer.toLowerCase()) {
      case 'fajr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        );
      case 'dhuhr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2.5" />
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
          </svg>
        );
      case 'asr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
          </svg>
        );
      case 'maghrib':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        );
      case 'isha':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'jummah':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
          </svg>
        );
      case 'eidulfitr':
      case 'eiduladha':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const fetchPrayerTimings = useCallback(async () => {
    try {
      const response = await axios.get(`/auth/getPrayerTimings/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      if (response.data.success) {
        setTimings(response.data.prayerTiming.timings);
        setHasTimings(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasTimings(false);
      } else {
        showToast("Failed to fetch prayer timings", "error");
      }
    }
  }, [masjidId, masjidtoken, showToast]);

  useEffect(() => {
    fetchPrayerTimings();
  }, [fetchPrayerTimings]);

  const handleTimeChange = (prayer, value) => {
    setTimings(prevTimings => {
      const newTimings = {
        ...prevTimings,
        [prayer]: value
      };
      return newTimings;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the current form data
    const currentTimings = {};
    
    Object.keys(timings).forEach(prayer => {
      const input = e.target.querySelector(`input[name="${prayer}"]`);
      if (input) {
        currentTimings[prayer] = input.value;
      }
    });

   
    try {
      const response = await axios.put(
        `/auth/updatePrayerTimings/${masjidId}`,
        { timings: currentTimings },
        { headers: { Authorization: `Bearer ${masjidtoken}` } }
      );
      
      if (response.data.success) {
        showToast("Prayer timings updated successfully", "success");
        setIsEditing(false);
        setHasTimings(true);
        await fetchPrayerTimings();
      }
    } catch (error) {
      console.error("Update error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      showToast(error.response?.data?.error || "Failed to update prayer timings", "error");
    }
  };
  

  const prayerLabels = {
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    jummah: "Jummah",
    eidUlFitr: "Eid-Ul-Fitr",
    eidUlAdha: "Eid-Ul-Adha"
  };

  if (!hasTimings && !isEditing) {
    return (
      <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">No Prayer Timings Set</h2>
          <p className="text-amber-200 mb-6">Please add prayer timings for your masjid</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
          >
            Add Prayer Timings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Prayer Timings</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-300"
        >
          {isEditing ? "Cancel" : "Edit Timings"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(timings).map(([prayer, time]) => (
            <div key={prayer} className="bg-teal-900/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-800/50 rounded-full">
                  {getPrayerIcon(prayer)}
                </div>
                <label className="text-amber-200">{prayerLabels[prayer]}</label>
              </div>
              {isEditing ? (
                <input
                  type="time"
                  name={prayer}
                  defaultValue={time}
                  onChange={(e) => handleTimeChange(prayer, e.target.value)}
                  className="w-full px-3 py-2 bg-teal-800/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              ) : (
                <div className="text-white text-lg font-semibold">{time}</div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>

      <div className="mt-6 text-sm text-amber-200">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PrayerTiming; 