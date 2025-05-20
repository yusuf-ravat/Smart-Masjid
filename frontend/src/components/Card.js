import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ title, link }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(link)}
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border hover:border-yellow-600"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-yellow-600 text-sm mt-2">Click to view</p>
    </div>
  );
};

export default Card;
