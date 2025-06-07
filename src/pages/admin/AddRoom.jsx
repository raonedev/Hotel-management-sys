// src/pages/admin/AddRoom.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../../components/admin/Sidebar";

const AddRoom = () => {
  const navigate = useNavigate();
  const { id: roomId } = useParams(); // Get room ID from URL parameters for edit mode

  const [formData, setFormData] = useState({
    name: '',
    category: 'Standard', // Default category
    price: '',
    capacity: '',
    bookingStatus: 'Available', // Default status
    description: '',
    amenities: [], // Array of strings
    images: [], // Array of image URLs
  });

  const [currentAmenity, setCurrentAmenity] = useState(''); // For adding individual amenities
  const [currentImage, setCurrentImage] = useState(''); // For adding individual images

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true); // For loading existing room data
  const [roomFetchError, setRoomFetchError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to check login status and fetch room data if in edit mode
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/"); // Redirect to home/login page if no token
      return;
    }

    // If an ID is present, fetch room data for editing
    if (roomId) {
      const fetchRoom = async () => {
        setLoadingRoom(true);
        setRoomFetchError(null);
        setSubmitError(null); // Clear any previous submit errors
        setSubmitSuccess(false); // Clear any previous submit success messages

        try {
          const res = await axios.get(`https://hotel-management-sys-backend-production.up.railway.app/api/rooms/${roomId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          // Populate form data with fetched room details
          const roomData = res.data;
          setFormData({
            name: roomData.name || '',
            category: roomData.category || 'Standard',
            price: roomData.price || '',
            capacity: roomData.capacity || '',
            bookingStatus: roomData.bookingStatus || 'Available',
            description: roomData.description || '',
            amenities: roomData.amenities || [],
            images: roomData.images || [],
          });
        } catch (err) {
          console.error('Failed to fetch room details:', err);
          if (err.response && err.response.status === 401) {
            setRoomFetchError("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("jwtToken");
            navigate("/");
          } else {
            setRoomFetchError(err.response?.data?.message || "Failed to load room details.");
          }
        } finally {
          setLoadingRoom(false);
        }
      };
      fetchRoom();
    } else {
      setLoadingRoom(false); // No ID, so not loading an existing room
    }
  }, [roomId, navigate]); // Rerun when ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAmenity = () => {
    if (currentAmenity.trim() !== '') {
      setFormData(prevData => ({
        ...prevData,
        amenities: [...prevData.amenities, currentAmenity.trim()]
      }));
      setCurrentAmenity(''); // Clear input
    }
  };

  const handleRemoveAmenity = (indexToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      amenities: prevData.amenities.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddImage = () => {
    if (currentImage.trim() !== '') {
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, currentImage.trim()]
      }));
      setCurrentImage(''); // Clear input
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setSubmitError("Authentication token not found. Please log in.");
      setSubmitting(false);
      navigate("/");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity, 10),
      };

      let res;
      if (roomId) {
        // If ID exists, it's an EDIT (PUT request)
        // Ensure the _id is also in the payload if your PUT API requires it, although generally not needed for path param.
        const editPayload = { ...payload, _id: roomId };
        res = await axios.put(`https://hotel-management-sys-backend-production.up.railway.app/api/rooms/${roomId}`, editPayload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // If no ID, it's an ADD (POST request)
        res = await axios.post('https://hotel-management-sys-backend-production.up.railway.app/api/rooms', payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (res.status === 200 || res.status === 201) { // 200 for PUT, 201 for POST
        setSubmitSuccess(true);
        if (!roomId) { // Only reset form if it was an add operation
          setFormData({
            name: '',
            category: 'Standard',
            price: '',
            capacity: '',
            bookingStatus: 'Available',
            description: '',
            amenities: [],
            images: [],
          });
          setCurrentAmenity('');
          setCurrentImage('');
        }
        setTimeout(() => {
          navigate('/admin/rooms'); // Navigate back to rooms list
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to save room:', err);
      if (err.response && err.response.status === 401) {
        setSubmitError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setSubmitError(err.response?.data?.message || "Failed to save room. Please check your inputs.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading/error states for fetching existing room data
  if (roomId && loadingRoom) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-blue-400 text-xl">Loading room details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (roomId && roomFetchError) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="bg-red-800 p-4 rounded-lg shadow-md text-red-100 text-center text-lg">
              <p>{roomFetchError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">
            {roomId ? 'Edit Room Details' : 'Add New Room'}
          </h2>

          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Basic Room Details */}
              <div>
                <label htmlFor="name" className="block text-gray-300 text-lg font-semibold mb-2">
                  Room Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-gray-300 text-lg font-semibold mb-2">
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Executive">Executive</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-gray-300 text-lg font-semibold mb-2">
                  Price per Night ($):
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-gray-300 text-lg font-semibold mb-2">
                  Capacity (Guests):
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bookingStatus" className="block text-gray-300 text-lg font-semibold mb-2">
                  Booking Status:
                </label>
                <select
                  id="bookingStatus"
                  name="bookingStatus"
                  value={formData.bookingStatus}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-300 text-lg font-semibold mb-2">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Amenities */}
              <div className="md:col-span-2">
                <label htmlFor="newAmenity" className="block text-gray-300 text-lg font-semibold mb-2">
                  Amenities:
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    id="newAmenity"
                    value={currentAmenity}
                    onChange={(e) => setCurrentAmenity(e.target.value)}
                    placeholder="e.g., Free WiFi, AC"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-700 text-gray-200 text-sm px-3 py-1 rounded-full flex items-center">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="ml-2 text-red-400 hover:text-red-600 focus:outline-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label htmlFor="newImage" className="block text-gray-300 text-lg font-semibold mb-2">
                  Image URLs:
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url" // Use type="url" for image URLs
                    id="newImage"
                    value={currentImage}
                    onChange={(e) => setCurrentImage(e.target.value)}
                    placeholder="e.g., https://example.com/room.jpg"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Room Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-700"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/1F2937/D1D5DB?text=Error"; }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-800 p-3 rounded-lg shadow-md text-red-100 text-center mb-4">
                <p>{submitError}</p>
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
                <p>Room {roomId ? 'updated' : 'added'} successfully!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || (roomId && loadingRoom)}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors duration-200
                ${submitting || (roomId && loadingRoom)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
            >
              {submitting ? (roomId ? 'Updating Room...' : 'Adding Room...') : (roomId ? 'Update Room' : 'Add Room')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
