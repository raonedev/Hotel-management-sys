import React from "react";
import { Link, useNavigate } from "react-router-dom";

// The Navbar component now accepts an 'isLoggedIn' prop
const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear JWT token and user role from local storage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    // Navigate to home page after logout
    navigate('/');
    window.location.reload();
  };

  return (
    // Main navigation container with dark background, blur effect, and shadow
    <nav className="fixed top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg w-full flex justify-between items-center px-4 sm:px-6 py-3 font-inter rounded-b-xl">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition duration-300">
        <Link to="/">HotelVista</Link>{" "}
      </div>

      {/* Center: Nav Links - hidden on small screens */}
      <div className="space-x-4 md:space-x-8 text-lg hidden md:flex">
        <Link
          to="/"
          className="text-gray-200 hover:text-blue-400 transition duration-300 font-medium"
        >
          Home
        </Link>
        <Link
          to="/room"
          className="text-gray-200 hover:text-blue-400 transition duration-300 font-medium"
        >
          Rooms
        </Link>
        <Link
          to="/chat"
          className="text-gray-200 hover:text-blue-400 transition duration-300 font-medium"
        >
          Chat
        </Link>
      </div>

      {/* Right: Buttons - Conditionally rendered based on isLoggedIn prop */}
      <div className="space-x-2 sm:space-x-4 flex items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button
                className="px-4 py-2 rounded-lg border border-blue-600 text-blue-400 font-semibold
                           hover:bg-blue-900 hover:border-blue-500 transition duration-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button
                className="px-4 py-2 rounded-lg text-white font-semibold
                           bg-gradient-to-r from-blue-600 to-purple-600 shadow-md
                           hover:from-blue-700 hover:to-purple-700 transition duration-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Signup
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md
                       hover:bg-red-700 transition duration-300
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
