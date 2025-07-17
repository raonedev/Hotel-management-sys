// src/pages/admin/Rooms.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';
import RoomCard from "../../components/admin/RoomCard"; // Make sure this path is correct
import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // New state for delete success message
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // For Navbar prop


  // Function to fetch rooms (can be called from useEffect and after delete)
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate("/"); // Redirect to login page if token is missing
      return;
    }
    setIsLoggedIn(true); // Set login status

    try {
      const res = await axios.get("https://hotel-management-sys-backend.vercel.app/api/rooms", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setError("Failed to load rooms. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []); // Run once on mount to fetch initial rooms

  // Function to handle room deletion
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return; // User cancelled
    }

    setLoading(true); // Show loading while deleting
    setError(null); // Clear previous errors
    setDeleteSuccess(false); // Clear previous success messages

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      await axios.delete(`https://hotel-management-sys-backend.vercel.app/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setDeleteSuccess(true); // Set success message
      fetchRooms(); // Re-fetch rooms to update the list
      setTimeout(() => setDeleteSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error('Failed to delete room:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to delete room. Please try again.");
      }
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Manage Rooms</h2>

          {/* Delete success message */}
          {deleteSuccess && (
            <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
              <p>Room deleted successfully!</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-blue-400 text-xl">Loading rooms...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-800 p-4 rounded-lg shadow-md text-red-100 text-center text-lg">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
                  onClick={() => navigate('/admin/rooms/add')} // Navigate to add room page
                >
                  + Add New Room
                </button>
              </div>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <RoomCard
                      key={room._id}
                      room={room}
                      onDelete={handleDeleteRoom} // Pass the delete handler to RoomCard
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                  <p className="text-xl text-gray-400">No rooms found.</p>
                  <p className="text-gray-500 mt-2">Start by adding a new room!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rooms;
