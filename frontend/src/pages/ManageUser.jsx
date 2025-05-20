import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import MasjidNavbar from "../components/MasjidNavbar";
import {getMasjidData} from "../utils/storageHelper";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { masjidId, masjidtoken } = getMasjidData(); // Call getAdminData here

  // Fetch users who joined the masjid
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the masjidController
        const res = await axios.get(`/auth/getMasjidUsers/${masjidId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [masjidId, masjidtoken]);

  // Handle removing a user
  const handleRemoveUser = async (userId) => {
    try {
      await axios.post(
        "/auth/removeMasjidUser",
        { userId, masjidId },
        { headers: { Authorization: `Bearer ${masjidtoken}` } }
      );
      setUsers(users.filter((user) => user.userId !== userId));
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.masjidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.masjidLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <MasjidNavbar />
      <section className="py-12 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-white">Manage Users</h2>
            <input
              type="text"
              placeholder="Search by name, email, or masjid details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 max-w-md px-4 py-2 bg-teal-900/50 text-white border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
            />
          </div>
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-teal-700 scrollbar-rounded">
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
              {filteredUsers.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-teal-900/50 text-amber-200">
                      <th className="p-3 text-sm font-medium">#</th>
                      <th className="p-3 text-sm font-medium">Name</th>
                      <th className="p-3 text-sm font-medium">Email</th>
                      <th className="p-3 text-sm font-medium">Mobile Number</th>
                      <th className="p-3 text-sm font-medium">Masjid Name</th>
                      <th className="p-3 text-sm font-medium">Masjid Location</th>
                      <th className="p-3 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.userId}
                        className="border-b border-teal-600/30 hover:bg-teal-900/30 transition-all duration-300"
                      >
                        <td className="p-3 text-sm text-amber-100">{index + 1}</td>
                        <td className="p-3 text-sm text-amber-100">{user.name}</td>
                        <td className="p-3 text-sm text-amber-100">{user.email}</td>
                        <td className="p-3 text-sm text-amber-100">{user.mobileNumber}</td>
                        <td className="p-3 text-sm text-amber-100">{user.masjidName}</td>
                        <td className="p-3 text-sm text-amber-100">{user.masjidLocation}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleRemoveUser(user.userId)}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-lg hover:from-amber-700 hover:to-amber-800 transform hover:scale-105 transition-all duration-300 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-amber-200 text-center py-4">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageUser;