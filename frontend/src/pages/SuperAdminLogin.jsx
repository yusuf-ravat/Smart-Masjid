import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const SuperAdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { toast, showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      showToast("Email and password are required.", "error");
      return;
    }
    try {
      const res = await axios.post("auth/superAdminLogin", form);
      localStorage.setItem("superToken", res.data.token);
      localStorage.setItem("superAdminName", res.data.name);
      localStorage.setItem("superAdminId", res.data.adminId);

      showToast("Login successful!", "success");
      const timer = setTimeout(() => navigate("/superadmin/dashboard"), 1000);
      return () => clearTimeout(timer); // Cleanup timeout
    } catch (err) {
      const errorMessage =
        err.response?.data?.error === "Super admin not found"
          ? "Email is incorrect."
          : err.response?.data?.error === "Invalid credentials"
          ? "Password is incorrect."
          : "Login failed. Please try again.";
      showToast(errorMessage, "error");
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => clearTimeout(); // Ensure no lingering timeouts
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col md:flex-row relative overflow-hidden">
     {/* Toast Notification */}
     <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Left Banner */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 bg-gradient-to-br from-emerald-900 to-emerald-700">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/masjid-bg.jpg')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-30" />
        {/* Islamic Arch Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 M50 20 A30 30 0 0 0 20 50 A30 30 0 0 0 50 80 A30 30 0 0 0 80 50 A30 30 0 0 0 50 20' fill='%23D4A017' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div className="text-center text-white z-10 animate-scale-in">
          <h1 className="text-5xl font-sans font-bold mb-4 tracking-wide drop-shadow-lg">
            Super Admin Portal
          </h1>
          <p className="text-xl font-sans font-light drop-shadow-md">
            Command Your Masjid Network
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white to-gray-100 p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-fade-in relative border-t-4 border-[#064e3b]">
          {/* Header */}
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-[#064e3b]">🕌</span> Super Admin
          </h2>
          <p className="text-center text-md text-gray-600 mb-8">
            Welcome Back, Super Admin
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                name="email"
                onChange={handleChange}
                value={form.email}
                type="email"
                id="email"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-[#064e3b] focus:ring-2 focus:ring-yellow-100 transition-all text-lg"
                placeholder="Email Address"
                required
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
                placeholder="Password"
                required
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
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-[#064e3b] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;