import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import AdminTable from "../components/AdminTable";
import { Bar } from "react-chartjs-2";
import { getSuperAdminData, clearSuperAdminData } from "../utils/storageHelper";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SuperAdminDashboard = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { toast, showToast } = useToast();
  const [pendingMasjids, setPendingMasjids] = useState([]);
  const [approvedMasjids, setApprovedMasjids] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalMasjids: 0,
    jamaMasjids: 0,
    normalMasjids: 0,
    activeAdmins: 0,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { superAdminId, superToken } = getSuperAdminData();
  const navigate = useNavigate();

  // Chart data configuration
  const chartData = {
    labels: ["Total Masjids", "Jama Masjids", "Normal Masjids", "Active Admins"],
    datasets: [
      {
        label: "Masjid Network Analytics",
        data: [
          analytics.totalMasjids,
          analytics.jamaMasjids,
          analytics.normalMasjids,
          analytics.activeAdmins,
        ],
        backgroundColor: [
          "rgba(6, 78, 59, 0.6)", // #064e3b
          "rgba(110, 95, 70, 0.6)", // #6e5f4699
          "rgba(212, 160, 23, 0.6)", // #D4A017
          "rgba(34, 197, 94, 0.6)", // Green shade
        ],
        borderColor: [
          "rgba(6, 78, 59, 1)",
          "rgba(110, 95, 70, 1)",
          "rgba(212, 160, 23, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
          color: "#064e3b",
        },
      },
      title: {
        display: true,
        text: "Masjid Network Overview",
        font: {
          size: 18,
          weight: "bold",
          family: "'Poppins', sans-serif",
        },
        color: "#064e3b",
      },
      tooltip: {
        backgroundColor: "#064e3b",
        titleFont: { 
          size: 14,
          family: "'Poppins', sans-serif",
        },
        bodyFont: { 
          size: 12,
          family: "'Poppins', sans-serif",
        },
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
          font: { 
            size: 14,
            family: "'Poppins', sans-serif",
          },
          color: "#064e3b",
        },
        ticks: {
          color: "#064e3b",
          font: { 
            size: 12,
            family: "'Poppins', sans-serif",
          },
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories",
          font: { 
            size: 14,
            family: "'Poppins', sans-serif",
          },
          color: "#064e3b",
        },
        ticks: {
          color: "#064e3b",
          font: { 
            size: 12,
            family: "'Poppins', sans-serif",
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!superToken || !superAdminId) {
        if (!isLoggingOut) {
          showToast("Please log in as Super Admin.", "error");
          setTimeout(() => navigate("/superadmin"), 1000);
        }
        return;
      }
      try {
        // Fetch all data concurrently
        const [superAdminRes, allMasjidsRes, pendingMasjidsRes, approvedMasjidsRes] = await Promise.all([
          axios.get(`/auth/getsuperAdmin/${superAdminId}`, {
            headers: { Authorization: `Bearer ${superToken}` },
          }),
          axios.get("/auth/getAllMasjids", {
            headers: { Authorization: `Bearer ${superToken}` },
          }),
          axios.get("/auth/getPendingMasjids", {
            headers: { Authorization: `Bearer ${superToken}` },
          }),
          axios.get("/auth/getApprovedMasjids", {
            headers: { Authorization: `Bearer ${superToken}` },
          }),
        ]);
        const profile = superAdminRes.data;
        const allMasjids = allMasjidsRes.data;
        const pendingMasjids = pendingMasjidsRes.data;
        const approvedAdmins = approvedMasjidsRes.data;

        // Set form with fetched profile data
        setForm({ name: profile.name, email: profile.email, password: "" });

        // Update state for pending and approved Masjids
        setPendingMasjids(pendingMasjids);
        setApprovedMasjids(approvedAdmins);

        // Calculate analytics
        const totalMasjids = allMasjids.length;
        const jamaMasjids = allMasjids.filter((m) => m.masjidType === "jama").length;
        const normalMasjids = allMasjids.filter((m) => m.masjidType === "normal").length;
        const activeAdmins = approvedAdmins.length;

        setAnalytics({
          totalMasjids,
          jamaMasjids,
          normalMasjids,
          activeAdmins,
        });
      } catch (err) {
        showToast("Failed to fetch data.", "error");
      }
    };

    fetchData();
  }, [navigate, superToken, superAdminId, showToast, isLoggingOut]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) {
      showToast("Please enter a new password to update.", "error");
      return;
    }

    try {
      const res = await axios.put(
        `/auth/updateSuperAdmin/${superAdminId}`,
        { password: form.password },
        {
          headers: { Authorization: `Bearer ${superToken}` },
        }
      );
      showToast(res.data.message, "success");
      setForm({ ...form, password: "" });
    } catch (err) {
      showToast(err.response?.data?.error || "Update failed.", "error");
    }
  };

  const handleApprove = async (masjidId) => {
    try {
      await axios.put(
        `/auth/approveMasjid/${masjidId}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${superToken}` } }
      );

      // Fetch updated approved Masjids
      const res = await axios.get("/auth/getApprovedMasjids", {
        headers: { Authorization: `Bearer ${superToken}` },
      });
      setApprovedMasjids(res.data);

      // Remove the approved masjid from the pending list
      setPendingMasjids(pendingMasjids.filter((masjid) => masjid._id !== masjidId));

      // Update analytics
      setAnalytics((prevAnalytics) => ({
        ...prevAnalytics,
        activeAdmins: prevAnalytics.activeAdmins + 1,
      }));

      showToast("Admin approved successfully.", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to approve masjid.", "error");
    }
  };

  const handleReject = async (masjidId) => {
    try {
      await axios.put(
        `/auth/approveMasjid/${masjidId}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${superToken}` } }
      );

      // Remove the rejected masjid from the pending list
      setPendingMasjids(pendingMasjids.filter((masjid) => masjid._id !== masjidId));

      showToast("Admin rejected successfully.", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to reject masjid.", "error");
    }
  };

  const handleDelete = async (masjidId) => {
    try {
      await axios.put(
        `/auth/setMasjidToPending/${masjidId}`,
        {},
        { headers: { Authorization: `Bearer ${superToken}` } }
      );

      // Remove the masjid from the approved list
      const deletedMasjid = approvedMasjids.find((masjid) => masjid._id === masjidId);
      setApprovedMasjids(approvedMasjids.filter((masjid) => masjid._id !== masjidId));

      // Add the masjid to the pending list
      if (deletedMasjid) {
        setPendingMasjids((prevPending) => [...prevPending, { ...deletedMasjid, status: "pending" }]);
      }

      // Update analytics
      setAnalytics((prevAnalytics) => ({
        ...prevAnalytics,
        activeAdmins: prevAnalytics.activeAdmins - 1,
      }));

      showToast("Masjid status set to pending.", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete masjid.", "error");
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    showToast("Logged out successfully.", "success");
    const timer = setTimeout(() => {
      clearSuperAdminData();
      navigate("/superadmin");
    }, 1000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Islamic Pattern Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 A40 40 0 0 1 90 50 votos A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 M50 20 A30 30 0 0 0 20 50 A30 30 0 0 0 50 80 A30 30 0 0 0 80 50 A30 30 0 0 0 50 20' fill='%23D4A017' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg z-40">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-200">🕌</span> Smart Masjid Manager Super Admin
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => document.getElementById("profile-form").scrollIntoView({ behavior: "smooth" })}
            className="bg-[#065f46] hover:bg-[#064e3b] text-white px-4 py-2 rounded-xl transition-all"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#065f46] hover:bg-[#064e3b] text-white px-4 py-2 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto relative z-10">
        {/* Analytics Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl shadow-2xl border-t-4 border-[#064e3b] animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-[#064e3b]">
                <img src="/icons/monitor.png" alt="Salah Icon" className="inline w-12 h-12 mr-2" />
              </span>{" "}
              Masjid Network Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl shadow-md">
                  <p className="text-lg font-semibold text-gray-700">Total Masjids</p>
                  <p className="text-2xl font-bold text-[#064e3b]">{analytics.totalMasjids}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-md">
                  <p className="text-lg font-semibold text-gray-700">Jama Masjids</p>
                  <p className="text-2xl font-bold text-[#064e3b]">{analytics.jamaMasjids}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-md">
                  <p className="text-lg font-semibold text-gray-700">Normal Masjids</p>
                  <p className="text-2xl font-bold text-[#064e3b]">{analytics.normalMasjids}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-md">
                  <p className="text-lg font-semibold text-gray-700">Active Admins</p>
                  <p className="text-2xl font-bold text-[#064e3b]">{analytics.activeAdmins}</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl shadow-md">
                <div style={{ height: "300px" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pending Registration Requests */}
        <AdminTable
          title="Pending Registration Requests"
          data={pendingMasjids}
          onApprove={handleApprove}
          onReject={handleReject}
          isPending={true}
        />

        {/* Registered Masjids */}
        <AdminTable
          title="Registered Masjids"
          data={approvedMasjids}
          onDelete={handleDelete}
          isPending={false}
        />

        {/* Update Profile Form */}
        <section id="profile-form">
          <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl shadow-2xl border-t-4 border-[#064e3b] animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-[#064e3b]">
                <img src="/icons/userupdate.png" alt="Salah Icon" className="inline w-12 h-12 mr-2" />
              </span>{" "}
              Update Super Admin Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  type="text"
                  id="name"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-[#064e3b] focus:ring-2 focus:ring-yellow-100 transition-all text-lg"
                  placeholder="New Name"
                  readOnly
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b] text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-[#064e3b] focus:ring-2 focus:ring-yellow-100 transition-all text-lg"
                  placeholder="New Email"
                  readOnly
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b] text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  type="password"
                  id="password"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-[#064e3b] focus:ring-2 focus:ring-yellow-100 transition-all text-lg"
                  placeholder="New Password"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b] text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#064e3b] text-white py-3 rounded-xl hover:bg-[#065f46] transition-all relative overflow-hidden group text-lg"
              >
                <span className="relative z-10">Update Details</span>
                <span className="absolute inset-0 bg-[#064e3b] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;