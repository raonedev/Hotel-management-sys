import React, { useEffect, useState } from "react";
import axios from 'axios';
import RoomCard from "../../components/admin/RoomCard";
import Sidebar from "../../components/admin/Sidebar"; // Assuming you need the sidebar

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To pass to Navbar

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      const jwtToken = localStorage.getItem("jwtToken");

      if (jwtToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return; // Stop execution if no token
      }

      try {
        const res = await axios.get("http://localhost:3000/api/rooms", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setRooms(res.data);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError("Failed to load rooms. Please try again later.");
        // Consider more specific error handling, e.g., if (err.response.status === 401) redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
  
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Manage Rooms</h2>

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
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200">
                  + Add New Room
                </button>
              </div>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <RoomCard key={room._id} room={room} />
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