import React, { useState } from "react";

const AdminTable = ({ title, data, onApprove, onReject, onDelete, isPending }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search filter
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const itemsPerPage = 10; // Number of items per page

  // Filter data based on the search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.masjidName.toLowerCase().includes(searchTerm.toLowerCase())||
      item.masjidType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl shadow-2xl border-t-4 border-[#064e3b] animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
  <span className="text-[#064e3b]">
    {isPending ? <img src="/icons/pendingrequest.png" alt="Salah Icon" className="inline w-12 h-12 mr-2"/> : <img src="/icons/registerd.png" alt="Salah Icon" className="inline w-12 h-12 mr-2"/>}
   
  </span> {title}
</h2>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, masjid name, or masjid type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
          />
        </div>

        {currentData.length === 0 ? (
          <p className="text-gray-600">No data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-green-100 text-gray-700">
                  <th className="p-3">#</th>
                  <th className="p-3">Admin Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Masjid Name</th>
                  <th className="p-3">Masjid Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">{startIndex + index + 1}</td> {/* Index number */}
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.mobileNumber}</td>
                    <td className="p-3">{item.masjidName}</td>
                    <td className="p-3">
                      {item.masjidType === "jama" ? "Jama Masjid" : "Normal Masjid"}
                    </td>
                    <td className="p-3 capitalize">{item.status}</td>
                    <td className="p-3 flex gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => onApprove(item._id)}
                            className="bg-[#064e3b] text-white px-3 py-1 rounded-lg hover:bg-[#065f46] transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onReject(item._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onDelete(item._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#064e3b] text-white"
            }`}
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#064e3b] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminTable;