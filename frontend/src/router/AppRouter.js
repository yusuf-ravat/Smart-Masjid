import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import MasjidsDashboard from "../pages/MasjidDashboard";
import MasjidRegister from "../pages/MasjidRegister";
import SuperAdminLogin from "../pages/SuperAdminLogin";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import MasjidJoin from "../pages/MasjidJoin";
import ManageUser from "../pages/ManageUser";
import ViewDonations from "../pages/ViewDonations";
import Events from "../pages/Events";

function AppRouter() {
  return (
    <Routes>
          {/* Redirect root path to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Define other routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<Login />} />      
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/masjidJoin" element={<MasjidJoin />} />

        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/view-donations" element={<ViewDonations />} />
        <Route path="/masjid" element={<MasjidRegister />} />
        <Route path="/masjid/dashboard" element={<MasjidsDashboard />} />
        <Route path="/events" element={<Events />} />

        <Route path="/superadmin" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      
    </Routes>
  );
}

export default AppRouter;
