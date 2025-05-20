import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    masjidName: "",
    masjidLocation: "",
    masjidType: "normal",
  });
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.password ||
      (isRegister &&
        (!form.name || !form.mobileNumber || !form.masjidName || !form.masjidLocation || !form.masjidType))
    ) {
      setToast({ message: "All fields are required.", type: "error", show: true });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }
    try {
      const url = isRegister ? "/auth/masjidRegister" : "/auth/masjidLogin";
      const body = isRegister
        ? form
        : { email: form.email, password: form.password };
      const res = await axios.post(url, body);
      if (isRegister) {
        setToast({message: "Registration successful! Your profile is under review. You'll be notified soon.",type: "success",show: true,
        });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
        setIsRegister(false);
      } else {
        if (!isRegister && res.data.token && res.data.status === "approved") {
          setToast({ message: "Login successful!", type: "success", show: true });
          setTimeout(() => setToast({ ...toast, show: false }), 3000);
          localStorage.setItem("masjidtoken", res.data.token);
          localStorage.setItem("masjidId", res.data.masjidId);
          localStorage.setItem("role", "admin");
          localStorage.setItem("name", res.data.name || "Admin"); 
          localStorage.setItem("masjidSaas", res.data.masjidSaas);
          localStorage.setItem("masjidType", res.data.masjidType); 
          localStorage.setItem("mobileNumber", res.data.mobileNumber);
          navigate("/masjid/dashboard");
        } else {
          setToast({
            message: " Your profile is under review. You'll be notified soon.",
            type: "error",
            show: true,
          });
          setTimeout(() => setToast({ ...toast, show: false }), 3000);
        }
      }
    } catch (err) {
      if (err.response?.data?.error === "Email is already registered") {
        setToast({message: "Email is already registered. Please use a different email.",type: "error",show: true,});
      } else if (err.response?.data?.error === "Mobile number is already registered") {
        setToast({ message: "Mobile number is already registered.", type: "error", show: true });
      } else if (err.response?.data?.error === "Admin not found") {
      } else if (err.response?.data?.error === "Invalid password") {
        setToast({ message: "Password is incorrect.", type: "error", show: true });
      } else if (err.response?.data?.error === "Admin not found") {
        setToast({ message: "Email is incorrect.", type: "error", show: true });
      } else {
        setToast({
          message: "Something went wrong. Please try again.",
          type: "error",
          show: true,
        });
      }
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 font-semibold left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Islamic Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Cpath d='M75 25L100 50L75 75L50 100L25 75L0 50L25 25L50 0Z' fill='%23FFFFFF' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="bg-teal-800/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 animate-fade-in relative border-t-4 border-amber-500/30">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-amber-400 relative"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Masjid Portal
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-px w-16 bg-amber-400/30"></div>
            <p className="mx-3 text-amber-200 text-sm">
              {isRegister ? "Join as an Admin" : "Welcome Back, Admin"}
            </p>
            <div className="h-px w-16 bg-amber-400/30"></div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative inline-flex items-center h-12 bg-teal-900/50 rounded-full w-48 sm:w-56">
            <span
              className={`absolute left-0 h-12 w-1/2 bg-amber-600/50 rounded-full transition-transform duration-300 ${
                isRegister ? "translate-x-full" : ""
              }`}
            />
            <button
              className={`relative z-10 w-1/2 text-base sm:text-lg font-semibold ${
                !isRegister ? "text-white" : "text-amber-200"
              }`}
              onClick={() => {
                setIsRegister(false);
                setForm({
                  name: "",
                  email: "",
                  mobileNumber: "",
                  password: "",
                  masjidName: "",
                  masjidLocation: "",
                  masjidType: "normal",
                });
              }}
            >
              Login
            </button>
            <button
              className={`relative z-10 w-1/2 text-base sm:text-lg font-semibold ${
                isRegister ? "text-white" : "text-amber-200"
              }`}
              onClick={() => {
                setIsRegister(true);
                setForm({
                  name: "",
                  email: "",
                  mobileNumber: "",
                  password: "",
                  masjidName: "",
                  masjidLocation: "",
                  masjidType: "normal",
                });
              }}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Row 1: Name and Mobile */}
              <div className="relative">
                <input
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  type="text"
                  id="name"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Full Name"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
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
                  name="mobileNumber"
                  onChange={handleChange}
                  value={form.mobileNumber}
                  type="tel"
                  id="mobileNumber"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Mobile Number (e.g., +1234567890)"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </span>
              </div>

              {/* Row 2: Email and Password */}
              <div className="relative">
                <input
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  type="email"
                  id="email"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Email Address"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 sm:size-6"
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
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Password"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
              </div>

              {/* Row 3: Masjid Name and Masjid Location */}
              <div className="relative">
                <input
                  name="masjidName"
                  onChange={handleChange}
                  value={form.masjidName}
                  type="text"
                  id="masjidName"
                  className=" outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Masjid Name"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m-1.5-9h6m-6 0h-6m6 0v6m-6-6v6"
                    />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  name="masjidLocation"
                  onChange={handleChange}
                  value={form.masjidLocation}
                  type="text"
                  id="masjidLocation"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Masjid Location"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </span>
              </div>
              <div className="relative col-span-2">
                <select
                  name="masjidType"
                  onChange={handleChange}
                  value={form.masjidType}
                  id="masjidType"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg appearance-none cursor-pointer"
                >
                  <option value="normal" className="bg-teal-900 text-white">Normal Masjid</option>
                  <option value="jama" className="bg-teal-900 text-white">Jama Masjid</option>
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Login Fields: Email and Password */}
              <div className="relative">
                <input
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  type="email"
                  id="email"
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Email Address"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 sm:size-6"
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
                  className="outline-none w-full pl-10 pr-4 py-3 bg-teal-900/50 text-white border border-teal-600 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base sm:text-lg placeholder-amber-200/50"
                  placeholder="Password"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xl sm:text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all relative overflow-hidden group text-base sm:text-lg"
          >
            <span className="relative z-10">{isRegister ? "Register" : "Login"}</span>
            <span className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister; 