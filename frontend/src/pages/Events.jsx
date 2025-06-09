import React, { useState, useEffect } from 'react';
import { getMasjidData } from '../utils/storageHelper';
import axios from '../api/axiosInstance';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import MasjidNavbar from "../components/MasjidNavbar";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    contribution: '',
    maxParticipants: ''
  });
  const { masjidId, masjidtoken } = getMasjidData();
  const { toast, showToast } = useToast();
  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/auth/getMasjidEvents/${masjidId}`, {
        headers: { Authorization: `Bearer ${masjidtoken}` }
      });
      setEvents(response.data);
    } catch (error) {
      showToast('Failed to fetch events', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        // Update existing event
        await axios.put(`auth/updateEvent/${currentEvent._id}`, formData, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        showToast('Event updated successfully', 'success');
      } else {
        // Create new event
        console.log(formData);  
        await axios.post('auth/createEvent', {
          ...formData,
          masjidId
        }, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        showToast('Event created successfully', 'success');
      }
      setIsModalOpen(false);
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        contribution: '',
        maxParticipants: ''
      });
      // Fetch events immediately after creating/updating
      await fetchEvents();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      contribution: event.contribution,
      maxParticipants: event.maxParticipants
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/auth/deleteEvent/${eventId}`, {
          headers: { Authorization: `Bearer ${masjidtoken}` }
        });
        showToast('Event deleted successfully', 'success');
        await fetchEvents();
      } catch (error) {
        showToast('Failed to delete event', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <MasjidNavbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-500/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Manage Events</h1>
            <button
              onClick={() => {
                setCurrentEvent(null);
                setFormData({
                  title: '',
                  description: '',
                  date: '',
                  time: '',
                  location: '',
                  contribution: '',
                  maxParticipants: ''
                });
                setIsModalOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 mt-5 rounded-lg transition-colors duration-200"
            >
              Add New Event
            </button>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="text-center py-12 bg-teal-800/50 backdrop-blur-sm rounded-xl border border-teal-600/30">
              <i className="fas fa-calendar-times text-4xl text-amber-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
              <p className="text-amber-200">Start by adding your first event using the "Add New Event" button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="group relative bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-amber-500/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                  <div className="absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Event Content */}
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-amber-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {event.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="mt-1 text-sm text-amber-200">
                          {event.time}
                        </span>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-sm text-amber-100 mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      {event.contribution && (
                        <div className="flex items-center gap-2 text-sm text-amber-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Contribution: ${event.contribution}
                        </div>
                      )}
                      {event.maxParticipants && (
                        <div className="flex items-center gap-2 text-sm text-amber-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          Max Participants: {event.maxParticipants}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Event
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-amber-200 hover:text-red-400 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  {currentEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-amber-200 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-amber-200 mb-1">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 mb-1">Contribution ($)</label>
                      <input
                        type="number"
                        name="contribution"
                        value={formData.contribution}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-200 mb-1">Max Participants</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-amber-200 hover:text-amber-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {currentEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events; 