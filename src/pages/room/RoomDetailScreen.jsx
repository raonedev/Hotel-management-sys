import React, { useState, useEffect } from 'react';
// Import BrowserRouter, Routes, and Route from react-router-dom
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

// RoomDetailScreen component to display individual room details
const RoomDetailScreen = () => {
  const { id } = useParams(); // Get the room ID from the URL parameters
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For image carousel
  const navigate = useNavigate(); // For back button

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch individual room details from the backend
        const response = await fetch(`http://localhost:3000/api/rooms/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoom(data);
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError(err.message || 'Failed to fetch room details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomDetails();
    }
  }, [id]); // Re-run effect if ID changes

  const goToNextImage = () => {
    if (room && room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
    }
  };

  const goToPrevImage = () => {
    if (room && room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + room.images.length) % room.images.length);
    }
  };

  if (loading) {
    return <p className="text-center text-xl text-blue-400 min-h-screen bg-gray-950 flex items-center justify-center">Loading room details...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500 min-h-screen bg-gray-950 flex flex-col items-center justify-center">Error: {error} <br /> <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">Back to Rooms</button></p>;
  }

  if (!room) {
    return <p className="text-center text-xl text-gray-400 min-h-screen bg-gray-950 flex items-center justify-center">Room not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-inter">
      <header className="text-center mb-8">
        <button
          onClick={() => navigate('/room')} // Navigate back to the main room list
          className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-all duration-300 mb-6"
        >
          &larr; Back to All Rooms
        </button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          {room.name || room.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          {room.category} - ${room.price} per night
        </p>
      </header>

      {/* Image Carousel */}
      <div className="relative max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-xl">
        {room.images && room.images.length > 0 ? (
          <>
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.name || room.title} image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/334155/E2E8F0?text=Image+Not+Found"; }}
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
                >
                  &#10094;
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
                >
                  &#10095;
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {room.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`block w-3 h-3 rounded-full ${currentImageIndex === idx ? 'bg-white' : 'bg-gray-400'}`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <img
            src="https://placehold.co/800x600/334155/E2E8F0?text=No+Images"
            alt="No images available"
            className="w-full h-96 object-cover"
          />
        )}
      </div>

      {/* Room Details */}
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h3 className="text-3xl font-bold text-white mb-4">Description</h3>
        <p className="text-gray-300 text-lg mb-6">{room.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">Capacity</h4>
            <p className="text-gray-300">{room.capacity} people</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">Booking Status</h4>
            <p className={`font-bold ${room.bookingStatus === 'Available' ? 'text-green-400' : 'text-red-400'}`}>
              {room.bookingStatus}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-2">Amenities</h4>
          {room.amenities && room.amenities.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {room.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No amenities listed.</p>
          )}
        </div>

        <button className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                           transform hover:-translate-y-0.5 transition-all duration-300 text-xl">
          Proceed to Booking
        </button>
      </div>
    </div>
  );
}
export default RoomDetailScreen