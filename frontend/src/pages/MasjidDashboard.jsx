import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasjidNavbar from "../components/MasjidNavbar";
import { getMasjidData } from "../utils/storageHelper";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import axios from "../api/axiosInstance";
import PrayerTiming from "../components/PrayerTiming";
import AnnouncementsSection from "../components/Admin/AnnouncementsSection";
import WelcomeSection from "../components/Admin/WelcomeSection";

const MasjidDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const { masjidId, masjidtoken } = getMasjidData();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <MasjidNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      <WelcomeSection totalUsers={totalUsers} />

      {/* Prayer Times Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrayerTiming />
        </div>
      </section>

      {/* Announcements Section */}
      <AnnouncementsSection />

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Quick Links</h2>
            <p className="text-amber-200 mt-2">Access key features to manage your masjid.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Manage Users"
              link="/masjid/users"
              icon={<i className="fas fa-users text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
            <Card
              title="View Donations"
              link="/masjid/view-donations"
              icon={<i className="fas fa-dollar-sign text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
            <Card
              title="Send Alerts"
              link="/masjid/send-alerts"
              icon={<i className="fas fa-bullhorn text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
            <Card
              title="Prayer Times"
              link="/masjid/prayer-times"
              icon={<i className="fas fa-clock text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
            <Card
              title="Volunteers"
              link="/masjid/volunteers"
              icon={<i className="fas fa-hands-helping text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
            <Card
              title="Settings"
              link="/masjid/settings"
              icon={<i className="fas fa-cog text-2xl text-amber-400"></i>}
              onNavigate={navigate}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const Card = ({ title, link, icon, onNavigate }) => {
  return (
    <div
      className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-amber-500/20 cursor-pointer"
      onClick={() => onNavigate(link)}
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
};

export default MasjidDashboard;