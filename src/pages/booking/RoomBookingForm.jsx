import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Main App component
const RoomBookingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get room ID from URL parameters

    // State variables for form fields, matching the Mongoose schema
    const [roomId, setRoomId] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhoneNumber, setGuestPhoneNumber] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paidAmount, setPaidAmount] = useState('0'); // Default to 0
    const [paymentStatus, setPaymentStatus] = useState('Pending'); // Default to 'Pending'
    const [bookingStatus, setBookingStatus] = useState('Pending'); // Default to 'Pending'
    const [notes, setNotes] = useState('');

    // State for messages (success/error)
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Set roomId from URL parameter when component mounts
        if (id) {
            setRoomId(id);
        }
    }, [id]);

    // Function to format date to YYYY-MM-DD for input type="date"
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log('1');

        setSubmissionMessage(''); // Clear previous messages
        setIsError(false);

        // Retrieve JWT token from localStorage
        const token = localStorage.getItem('jwtToken'); // Assuming the token is stored as 'token'

        if (!token) {
            setSubmissionMessage('Authentication token not found. Please log in.');
            setIsError(true);
            return;
        }
        console.log('1');

        // Construct the booking data object
        const bookingData = {
            room: roomId,
            guestName,
            guestEmail,
            guestPhoneNumber,
            checkInDate,
            checkOutDate,
            totalAmount: parseFloat(totalAmount), // Convert to number
            paidAmount: parseFloat(paidAmount),   // Convert to number
            paymentStatus,
            bookingStatus,
            notes,
        };

        try {
            console.log('1');
            console.log(token);
            const response = await fetch('https://hotel-management-sys-backend-production.up.railway.app/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                body: JSON.stringify(bookingData),
            });
            console.log('2');
            const data = await response.json();
            console.log('3');
            console.log(data);

            if (response.ok) {
                setSubmissionMessage('Booking created successfully!');
                setIsError(false);
                // Optionally, clear the form after successful submission
                // Optionally, redirect the user after a short delay
                setRoomId('');
                setGuestName('');
                setGuestEmail('');
                setGuestPhoneNumber('');
                setCheckInDate('');
                setCheckOutDate('');
                setTotalAmount('');
                setPaidAmount('0');
                setPaymentStatus('Pending');
                setBookingStatus('Pending');
                setNotes('');
                setTimeout(() => {
                    navigate(-1);// after sucess full booking go to previous page
                }, 1500);
            } else {
                setSubmissionMessage(data.message || 'Failed to create booking.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setSubmissionMessage('Network error or server is unreachable. Please try again later.');
            setIsError(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-inter flex items-center justify-center">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                <h2 className="text-4xl font-extrabold text-white text-center mb-6">Create New Booking</h2>
                <p className="text-gray-400 text-lg text-center mb-8">Fill in the details below to secure your reservation.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Submission Message */}
                    {submissionMessage && (
                        <div className={`p-3 rounded-lg text-center font-medium ${isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                            {submissionMessage}
                        </div>
                    )}

                    {/* Room ID and Guest Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="roomId" className="block text-gray-300 text-sm font-medium mb-2">Room ID <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="roomId"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-not-allowed opacity-75"
                                value={roomId}
                                readOnly
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="guestName" className="block text-gray-300 text-sm font-medium mb-2">Guest Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="guestName"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Guest Email and Guest Phone Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="guestEmail" className="block text-gray-300 text-sm font-medium mb-2">Guest Email</label>
                            <input
                                type="email"
                                id="guestEmail"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="john.doe@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="guestPhoneNumber" className="block text-gray-300 text-sm font-medium mb-2">Guest Phone Number</label>
                            <input
                                type="tel"
                                id="guestPhoneNumber"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={guestPhoneNumber}
                                onChange={(e) => setGuestPhoneNumber(e.target.value)}
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    {/* Check-in Date and Check-out Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="checkInDate" className="block text-gray-300 text-sm font-medium mb-2">Check-in Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                id="checkInDate"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={formatDate(checkInDate)}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="checkOutDate" className="block text-gray-300 text-sm font-medium mb-2">Check-out Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                id="checkOutDate"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={formatDate(checkOutDate)}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Total Amount and Paid Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="totalAmount" className="block text-gray-300 text-sm font-medium mb-2">Total Amount <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                id="totalAmount"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="paidAmount" className="block text-gray-300 text-sm font-medium mb-2">Paid Amount</label>
                            <input
                                type="number"
                                id="paidAmount"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Payment Status and Booking Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="paymentStatus" className="block text-gray-300 text-sm font-medium mb-2">Payment Status</label>
                            <select
                                id="paymentStatus"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="bookingStatus" className="block text-gray-300 text-sm font-medium mb-2">Booking Status</label>
                            <select
                                id="bookingStatus"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={bookingStatus}
                                onChange={(e) => setBookingStatus(e.target.value)}
                            >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Checked-In">Checked-In</option>
                                <option value="Checked-Out">Checked-Out</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-gray-300 text-sm font-medium mb-2">Notes</label>
                        <textarea
                            id="notes"
                            rows="3"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests or comments..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 mt-6 text-white font-semibold rounded-lg
                                   bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg
                                   hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                                   transform hover:-translate-y-0.5"
                    >
                        Create Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomBookingForm;

