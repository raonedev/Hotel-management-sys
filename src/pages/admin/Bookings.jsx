import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from 'date-fns'; // For better date formatting
import Sidebar from "../../components/admin/Sidebar"; // Assuming you need the sidebar

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);     // State for error handling

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null);   // Clear any previous errors

      try {
        const jwtToken = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

        if (!jwtToken) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          // Optionally redirect to login page if token is missing
          navigate("/");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/booking", {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass the JWT token in the Authorization header
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again later.");
        // More specific error handling could be added here, e.g., if (err.response.status === 401)
      } finally {
        setLoading(false); // Set loading to false when fetching ends (success or error)
      }
    };

    fetchBookings();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">All Bookings</h2>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-blue-400 text-xl">Loading bookings...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-800 p-4 rounded-lg shadow-md text-red-100 text-center text-lg">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700
                                transform hover:scale-102 transition-all duration-300 ease-in-out"
                    >
                      <h3 className="text-2xl font-bold text-blue-400 mb-4">Booking ID: {booking._id.substring(0, 8)}...</h3>
                      <div className="space-y-3 text-gray-300 text-lg">
                        <p>
                          <span className="font-semibold text-white">Room:</span> {booking.room.name} ({booking.room.category}) - ${booking.room.price}/night
                        </p>
                        <p>
                          <span className="font-semibold text-white">Guest Name:</span> {booking.guestName}
                        </p>
                        <p>
                          <span className="font-semibold text-white">Guest Email:</span> {booking.guestEmail}
                        </p>
                        <p>
                          <span className="font-semibold text-white">Phone:</span> {booking.guestPhoneNumber}
                        </p>
                        <p>
                          <span className="font-semibold text-white">Check-in:</span> {format(parseISO(booking.checkInDate), 'PPP')}
                        </p>
                        <p>
                          <span className="font-semibold text-white">Check-out:</span> {format(parseISO(booking.checkOutDate), 'PPP')}
                        </p>
                        <p>
                          <span className="font-semibold text-white">Total Amount:</span> <span className="text-green-400 font-bold">${booking.totalAmount}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-white">Payment Status:</span>{' '}
                          <span className={`font-bold ${booking.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>
                            {booking.paymentStatus}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-white">Booking Status:</span>{' '}
                          <span className={`font-bold ${booking.bookingStatus === 'Confirmed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {booking.bookingStatus}
                          </span>
                        </p>
                        {booking.notes && (
                          <p>
                            <span className="font-semibold text-white">Notes:</span> {booking.notes}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                          Booked on: {format(parseISO(booking.createdAt), 'PPP p')}
                        </p>
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                  <p className="text-xl text-gray-400">No bookings found.</p>
                  <p className="text-gray-500 mt-2">Check back later or add new bookings.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;