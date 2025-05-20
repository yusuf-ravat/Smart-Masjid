import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", mobileNumber: "+" });
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const handleChange = (e) => {
    if (e.target.name === "mobileNumber") {
      // Ensure the number always starts with +
      const value = e.target.value.startsWith("+") ? e.target.value : "+" + e.target.value;
      setForm({ ...form, [e.target.name]: value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const validateMobileNumber = (number) => {
    // Validate international phone number format
    const mobileRegex = /^\+[1-9]\d{1,14}$/;
    return mobileRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (!form.email || !form.password || (isRegister && (!form.name || !form.mobileNumber))) {
      setToast({ message: "All fields are required.", type: "error", show: true });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }

    // Validate mobile number if registering
    if (isRegister && !validateMobileNumber(form.mobileNumber)) {
      setToast({ message: "Please enter a valid mobile number with country code (e.g., +1234567890)", type: "error", show: true });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }

    try {
      const url = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? form
        : { email: form.email, password: form.password };

      const res = await axios.post(url, body);
      const { token, role, name, _id } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", _id);
        localStorage.setItem("username", name || "Guest");

        if (role === "user") {
          navigate("/user/dashboard");
        } else {
          navigate("/login");
        }
      } else {
        setToast({ message: "Registration successful!", type: "success", show: true });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
        setIsRegister(false);
      }
    } catch (err) {
      if (err.response?.data?.error === "Invalid password") {
        setToast({ message: "Password is incorrect.", type: "error", show: true });
      } else if (err.response?.data?.error === "User not found") {
        setToast({ message: "Email is incorrect.", type: "error", show: true });
      } else {
        setToast({ message: err.response?.data?.error || "Something went wrong. Please try again.", type: "error", show: true });
      }
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
  
        const { name, email } = res.data;
  
        // Send Google user data to your backend
        const backendRes = await axios.post("/auth/google", {
          name,
          email,
        });
  
        const { token, role } = backendRes.data;
  
        if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", name || "Guest");
      
        if (role === "user") {
          navigate("/user/dashboard");
        } else {
          navigate("/login");
        }
        }
      } catch (err) {
        console.error("Google login failed", err);
      }
    },
    onError: (error) => console.log("Google login error", error),
  });
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 relative overflow-hidden">
       {/* Toast Notification */}
       {toast.show && (
        <div className={`fixed top-4 font-semibold left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {toast.message}
        </div>
      )}
      {/* Geometric Islamic Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30v4h-4v2h4v4h2v-4h4v-2h-4V0h-2zM6 34v4H2v2h4v4h2v-4h4v-2H8v-4H6zm2-30v4H2v2h4v4h2V6h4V4H8V0H6z' fill='%239C92AC' fill-opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 animate-slide-in relative border-t-4 border-indigo-600">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-indigo-400/20 rounded-full blur"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-indigo-600 relative"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Masjid Portal
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-px w-16 bg-indigo-400/30"></div>
            <p className="text-center text-sm text-slate-600 mb-1 px-4">
              {isRegister ? "Create your account" : "Sign in to your community"}
            </p>
            <div className="h-px w-16 bg-indigo-400/30"></div>
          </div>
        </div>

        
        {/* Toggle Switch */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex items-center h-10 bg-slate-100 rounded-full w-48">
            <span
              className={`absolute left-0 h-10 w-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-transform duration-300 ${
                isRegister ? "translate-x-full" : ""
              }`}
            />
            <button
              className={`relative z-10 w-1/2 text-sm font-semibold ${
                !isRegister ? "text-white" : "text-slate-600"
              }`}
              onClick={() => {setIsRegister(false)
                setForm({ name: "", email: "", password: "", mobileNumber: "+" });
              }}
            >
              Login
            </button>
            <button
              className={`relative z-10 w-1/2 text-sm font-semibold ${
                isRegister ? "text-white" : "text-slate-600"
              }`}
              onClick={() => {
                setIsRegister(true);
                setForm({ name: "", email: "", password: "", mobileNumber: "+" });
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <>
              <div className="relative">
                <input
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  type="text"
                  id="name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all focus:outline-none"
                  placeholder="Full Name"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all focus:outline-none"
                  placeholder="Mobile Number (e.g., +1234567890)"
                  onKeyDown={(e) => {
                    // Prevent backspace from deleting the + if it's the only character
                    if (e.key === "Backspace" && form.mobileNumber === "+") {
                      e.preventDefault();
                    }
                  }}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </span>
              </div>
            </>
          )}
          <div className="relative">
            <input
              name="email"
              onChange={handleChange}
              value={form.email}
              type="email"
              id="email"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all focus:outline-none"
              placeholder="Email Address"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
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
              className="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all focus:outline-none"
              placeholder="Password"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">{isRegister ? "Sign Up" : "Login"}</span>
            <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </button>

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={googleLogin}
            className="w-full flex items-center justify-center bg-white text-slate-700 py-2 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition mt-2 shadow-sm"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;