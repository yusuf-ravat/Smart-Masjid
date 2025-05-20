import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-700">🕌 Masjid Manager</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-green-600">Admin</Link>
        <Link to="/donate" className="text-gray-700 hover:text-green-600">Donate</Link>
        <Link to="/prayer-times" className="text-gray-700 hover:text-green-600">Prayer Times</Link>
      </div>
    </nav>  
  );
};

export default Navbar;
