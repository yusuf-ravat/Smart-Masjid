import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MasjidNavbar from "../components/MasjidNavbar";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const ViewDonations = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 5;

  // Dummy data for donations
  const dummyDonations = [
    {
      id: 1,
      donorName: "Ahmed Khan",
      amount: 500,
      date: "2025-04-05T10:30:00",
      message: "For masjid maintenance",
      status: "completed",
      type: "Zakat"
    },
    {
      id: 2,
      donorName: "Fatima Ali",
      amount: 1000,
      date: "2025-04-05T15:45:00",
      message: "Monthly contribution",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 3,
      donorName: "Mohammed Hassan",
      amount: 250,
      date: "2025-04-05T09:15:00",
      message: "For new prayer mats",
      status: "pending",
      type: "Sadqa"
    },
    {
      id: 4,
      donorName: "Aisha Rahman",
      amount: 750,
      date: "2025-04-05T14:20:00",
      message: "General donation",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 5,
      donorName: "Yusuf Malik",
      amount: 300,
      date: "2025-04-05T11:00:00",
      message: "For educational programs",
      status: "completed",
      type: "Zakat"
    },
    {
      id: 6,
      donorName: "Zainab Ahmed",
      amount: 1200,
      date: "2025-04-05T16:30:00",
      message: "For renovation project",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 7,
      donorName: "Omar Farooq",
      amount: 400,
      date: "2025-04-05T13:45:00",
      message: "Monthly contribution",
      status: "completed",
      type: "Sadqa"
    },
    {
      id: 8,
      donorName: "Huda Ibrahim",
      amount: 600,
      date: "2025-04-05T10:15:00",
      message: "For charity fund",
      status: "pending",
      type: "Zakat"
    },
    {
      id: 9,
      donorName: "Bilal Khan",
      amount: 800,
      date: "2025-04-05T14:50:00",
      message: "For new sound system",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 10,
      donorName: "Sara Malik",
      amount: 350,
      date: "2025-04-05T09:30:00",
      message: "General donation",
      status: "completed",
      type: "Sadqa"
    },
    {
      id: 11,
      donorName: "Abdul Rahman",
      amount: 1500,
      date: "2025-04-05T16:20:00",
      message: "For Eid celebrations",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 12,
      donorName: "Maryam Khan",
      amount: 450,
      date: "2025-04-05T11:45:00",
      message: "For library books",
      status: "pending",
      type: "Zakat"
    },
    {
      id: 13,
      donorName: "Ibrahim Ali",
      amount: 2000,
      date: "2025-04-05T09:30:00",
      message: "For new AC units",
      status: "completed",
      type: "Lillah"
    },
    {
      id: 14,
      donorName: "Amina Hassan",
      amount: 650,
      date: "2025-04-05T14:15:00",
      message: "For cleaning supplies",
      status: "completed",
      type: "Sadqa"
    },
    {
      id: 15,
      donorName: "Mustafa Ahmed",
      amount: 900,
      date: "2025-04-05T10:00:00",
      message: "For security cameras",
      status: "pending",
      type: "Zakat"
    },
    {
      id: 16,
      donorName: "Layla Malik",
      amount: 550,
      date: "2024-02-29T15:30:00",
      message: "For children's programs",
      status: "completed"
    },
    {
      id: 17,
      donorName: "Hamza Khan",
      amount: 1200,
      date: "2024-02-28T13:20:00",
      message: "For new carpets",
      status: "completed"
    },
    {
      id: 18,
      donorName: "Noor Ali",
      amount: 300,
      date: "2024-02-27T11:45:00",
      message: "For water coolers",
      status: "pending"
    },
    {
      id: 19,
      donorName: "Yasmin Rahman",
      amount: 750,
      date: "2024-02-26T09:15:00",
      message: "For maintenance work",
      status: "completed"
    },
    {
      id: 20,
      donorName: "Khalid Malik",
      amount: 1800,
      date: "2024-02-25T16:40:00",
      message: "For new furniture",
      status: "completed"
    }
  ];

  // Calculate statistics by donation type
  const zakatDonations = dummyDonations.filter(donation => donation.type === "Zakat");
  const lillahDonations = dummyDonations.filter(donation => donation.type === "Lillah");
  const sadqaDonations = dummyDonations.filter(donation => donation.type === "Sadqa");

  const totalZakat = zakatDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalLillah = lillahDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalSadqa = sadqaDonations.reduce((sum, donation) => sum + donation.amount, 0);

  // Calculate statistics
  const totalDonations = dummyDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const monthlyDonations = dummyDonations
    .filter(donation => {
      const donationDate = new Date(donation.date);
      return donationDate.getMonth() === new Date().getMonth() && 
             donationDate.getFullYear() === new Date().getFullYear();
    })
    .reduce((sum, donation) => sum + donation.amount, 0);
  const averageDonation = totalDonations / dummyDonations.length;
  const pendingDonations = dummyDonations.filter(donation => donation.status === "pending");

  // Filter and paginate donations
  const filteredDonations = dummyDonations; // Show all donations
  const sortedDonations = [...filteredDonations].sort((a, b) => new Date(b.date) - new Date(a.date));
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = sortedDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

  // Handle donation actions
  const handleApproveDonation = (id) => {
    showToast("Donation approved successfully!", "success");
  };

  const handleRejectDonation = (id) => {
    showToast("Donation rejected successfully!", "success");
  };

  const handleExportDonations = () => {
    showToast("Donations exported successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <MasjidNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Welcome Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Donation Management
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl mx-auto">
            View and manage all donations received by your masjid.
          </p>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="py-8 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Donations Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Total Donations</p>
                  <h3 className="text-2xl font-bold text-white mt-2">${totalDonations.toLocaleString()}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  All Time
                </span>
              </div>
            </div>

            {/* Zakat Donations Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Zakat Donations</p>
                  <h3 className="text-2xl font-bold text-white mt-2">${totalZakat.toLocaleString()}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {zakatDonations.length} Donations
                </span>
              </div>
            </div>

            {/* Lillah Donations Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Lillah Donations</p>
                  <h3 className="text-2xl font-bold text-white mt-2">${totalLillah.toLocaleString()}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {lillahDonations.length} Donations
                </span>
              </div>
            </div>

            {/* Sadqa Donations Card */}
            <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Sadqa Donations</p>
                  <h3 className="text-2xl font-bold text-white mt-2">${totalSadqa.toLocaleString()}</h3>
                </div>
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {sadqaDonations.length} Donations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donations List Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Donations</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex items-center gap-2 bg-teal-900/50 rounded-lg px-3 py-2 border border-teal-600 hover:border-amber-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={handleExportDonations}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-teal-700 scrollbar-rounded">
              {currentDonations.length > 0 ? (
                currentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="bg-teal-900/50 rounded-lg p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 font-medium">${donation.amount.toLocaleString()}</p>
                        <p className="text-amber-200 text-sm">{donation.donorName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          donation.type === "Zakat" 
                            ? "bg-purple-600/20 text-purple-400" 
                            : donation.type === "Lillah"
                            ? "bg-blue-600/20 text-blue-400"
                            : "bg-green-600/20 text-green-400"
                        }`}>
                          {donation.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          donation.status === "completed" 
                            ? "bg-green-600/20 text-green-400" 
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}>
                          {donation.status}
                        </span>
                        <span className="text-amber-200 text-sm">
                          {new Date(donation.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {donation.message && (
                      <p className="text-amber-200 text-sm mt-2">{donation.message}</p>
                    )}
                    {donation.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveDonation(donation.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDonation(donation.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-amber-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-amber-200">No donations for the selected date.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredDonations.length > donationsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Previous
                </button>
                <span className="text-amber-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewDonations; 