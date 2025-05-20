import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { getMasjidData } from '../utils/storageHelper';
import useToast from '../hooks/useToast';

const UserPrayerTiming = () => {
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
  const [nextPrayer, setNextPrayer] = useState(null);
  const [hasTimings, setHasTimings] = useState(false);
  const { masjidId, masjidtoken } = getMasjidData();
  const { showToast } = useToast();

  const fetchPrayerTimings = useCallback(async () => {
    try {
      const response = await axios.get(`/auth/getPrayerTimings/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      if (response.data.success) {
        setTimings(response.data.prayerTiming.timings);
        calculateNextPrayer(response.data.prayerTiming.timings);
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
    // Update next prayer time every minute
    const interval = setInterval(() => {
      if (hasTimings) {
        calculateNextPrayer(timings);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrayerTimings, timings, hasTimings]);

  const calculateNextPrayer = (prayerTimes) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const prayerNames = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    };

    // Convert prayer times to minutes since midnight
    const prayerMinutes = {};
    Object.entries(prayerTimes).forEach(([prayer, time]) => {
      if (prayer !== 'jummah' && prayer !== 'eidUlFitr' && prayer !== 'eidUlAdha') {
        const [hours, minutes] = time.split(':').map(Number);
        prayerMinutes[prayer] = hours * 60 + minutes;
      }
    });

    // Find next prayer
    let nextPrayerTime = null;
    let nextPrayerName = null;

    for (const prayer of prayerOrder) {
      if (prayerMinutes[prayer] > currentTime) {
        nextPrayerTime = prayerMinutes[prayer];
        nextPrayerName = prayerNames[prayer];
        break;
      }
    }

    // If no prayer found for today, next prayer is tomorrow's Fajr
    if (!nextPrayerTime) {
      nextPrayerTime = prayerMinutes.fajr + 24 * 60;
      nextPrayerName = prayerNames.fajr;
    }

    const timeUntilNext = nextPrayerTime - currentTime;
    const hours = Math.floor(timeUntilNext / 60);
    const minutes = timeUntilNext % 60;

    setNextPrayer({
      name: nextPrayerName,
      time: `${hours}h ${minutes}m`
    });
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

  const getPrayerIcon = (prayer) => {
    switch (prayer.toLowerCase()) {
      case 'fajr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        );
      case 'dhuhr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2.5" />
            <path stroke="currentColor" strokeWidth="2.5 " strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
          </svg>
        );
      case 'asr':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
          </svg>
          
        );
      case 'maghrib':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        );
      case 'isha':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'jummah':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
          </svg>
        );
      case 'eidulfitr':
      case 'eiduladha':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!hasTimings) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Today's Prayer Times</h3>
            <p className="text-sm text-slate-500">Prayer timings not available yet</p>
          </div>
        </div>
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prayer Timings Not Available</h2>
          <p className="text-slate-600">The masjid admin has not set prayer timings yet.</p>
          <p className="text-slate-600 mt-2">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Today's Prayer Times</h3>
            <p className="text-sm text-slate-500">Daily prayer schedule</p>
          </div>
        </div>
        {nextPrayer && (
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium">Next Prayer: {nextPrayer.name}</p>
            <p className="text-xs text-indigo-500">{nextPrayer.time} remaining</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(timings).map(([prayer, time]) => (
          <div
            key={prayer}
            className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-slate-200 transform hover:scale-105 transition-all duration-300 ${
              nextPrayer?.name === prayerLabels[prayer] ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {getPrayerIcon(prayer)}
              </div>
              <h4 className="text-xs sm:text-sm font-medium text-slate-600 capitalize">{prayerLabels[prayer]}</h4>
              <p className="text-base sm:text-lg font-bold text-slate-900">{time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-slate-500 text-center">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserPrayerTiming; 