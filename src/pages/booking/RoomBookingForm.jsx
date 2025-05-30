import React, { useState } from 'react';

const RoomBookingForm = () => {
  // State variables for each input field
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [roomtype, setRoomtype] = useState('');
  const [noofguests, setNoofguests] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [email, setEmail] = useState('');
  const [contactno, setContactno] = useState('');
  const [errors, setErrors] = useState({}); // State for validation errors
  const [submissionMessage, setSubmissionMessage] = useState(''); // State for submission success/error messages

  // Validation function for form fields
  const validate = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10}$/; // Basic 10-digit phone number validation

    if (!fname.trim()) newErrors.fname = 'First Name is required';
    if (!lname.trim()) newErrors.lname = 'Last Name is required';
    if (!roomtype.trim()) newErrors.roomtype = 'Room Type is required';
    if (!noofguests || noofguests <= 0) newErrors.noofguests = 'Number of Guests must be a positive number';
    if (!from) newErrors.from = 'Check-in Date is required';
    if (!to) newErrors.to = 'Check-out Date is required';
    if (from && to && new Date(from) >= new Date(to)) newErrors.to = 'Check-out Date must be after Check-in Date';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Email is invalid';
    if (!contactno.trim()) newErrors.contactno = 'Contact Number is required';
    else if (!phoneRegex.test(contactno)) newErrors.contactno = 'Contact Number must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setSubmissionMessage(''); // Clear previous messages

    if (validate()) {
      // Form is valid, proceed with API call
      const bookingData = {
        fname,
        lname,
        roomtype,
        noofguests: parseInt(noofguests, 10), // Convert to number
        from,
        to,
        email,
        contactno,
      };

      try {
        const response = await fetch('http://localhost:4231/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          setSubmissionMessage('Booking successful! Your request has been sent.');
          // Optionally clear form fields after successful submission
          setFname('');
          setLname('');
          setRoomtype('');
          setNoofguests('');
          setFrom('');
          setTo('');
          setEmail('');
          setContactno('');
          setErrors({}); // Clear any lingering errors
        } else {
          const errorData = await response.json();
          setSubmissionMessage(`Booking failed: ${errorData.message || 'Something went wrong.'}`);
        }
      } catch (error) {
        console.error('Error during booking:', error);
        setSubmissionMessage('Network error or server is unreachable. Please try again later.');
      }
    } else {
      setSubmissionMessage('Please correct the errors in the form.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-inter flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white text-center mb-6">Book Your Room</h2>
        <p className="text-gray-400 text-lg text-center mb-8">Fill in the details below to secure your reservation.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fname" className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                id="fname"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="John"
              />
              {errors.fname && <p className="text-red-400 text-sm mt-2">{errors.fname}</p>}
            </div>
            <div>
              <label htmlFor="lname" className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                id="lname"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder="Doe"
              />
              {errors.lname && <p className="text-red-400 text-sm mt-2">{errors.lname}</p>}
            </div>
          </div>

          {/* Room Type and Number of Guests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomtype" className="block text-gray-300 text-sm font-medium mb-2">Room Type</label>
              <select
                id="roomtype"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={roomtype}
                onChange={(e) => setRoomtype(e.target.value)}
              >
                <option value="" disabled>Select a room type</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Family Room">Family Room</option>
                <option value="Honeymoon Suite">Honeymoon Suite</option>
                <option value="Accessible Room">Accessible Room</option>
                <option value="Studio Apartment">Studio Apartment</option>
              </select>
              {errors.roomtype && <p className="text-red-400 text-sm mt-2">{errors.roomtype}</p>}
            </div>
            <div>
              <label htmlFor="noofguests" className="block text-gray-300 text-sm font-medium mb-2">Number of Guests</label>
              <input
                type="number"
                id="noofguests"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={noofguests}
                onChange={(e) => setNoofguests(e.target.value)}
                min="1"
                placeholder="e.g., 2"
              />
              {errors.noofguests && <p className="text-red-400 text-sm mt-2">{errors.noofguests}</p>}
            </div>
          </div>

          {/* From and To Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="from" className="block text-gray-300 text-sm font-medium mb-2">Check-in Date</label>
              <input
                type="date"
                id="from"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              {errors.from && <p className="text-red-400 text-sm mt-2">{errors.from}</p>}
            </div>
            <div>
              <label htmlFor="to" className="block text-gray-300 text-sm font-medium mb-2">Check-out Date</label>
              <input
                type="date"
                id="to"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              {errors.to && <p className="text-red-400 text-sm mt-2">{errors.to}</p>}
            </div>
          </div>

          {/* Email and Contact Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="contactno" className="block text-gray-300 text-sm font-medium mb-2">Contact Number</label>
              <input
                type="tel" // Use type="tel" for phone numbers
                id="contactno"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={contactno}
                onChange={(e) => setContactno(e.target.value)}
                placeholder="e.g., 9876543210"
              />
              {errors.contactno && <p className="text-red-400 text-sm mt-2">{errors.contactno}</p>}
            </div>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div className={`p-3 rounded-lg text-center font-medium ${submissionMessage.includes('successful') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {submissionMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-semibold rounded-lg
                       bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                       transform hover:-translate-y-0.5"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomBookingForm;
