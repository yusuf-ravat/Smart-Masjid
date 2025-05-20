import React from "react";

const Toast = ({ message, type, show }) => {
  if (!show) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 font-semibold ${
        type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;