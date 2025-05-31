import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    // Main navigation container with dark background, blur effect, and shadow
    <nav className="fixed top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg w-full flex justify-between items-center px-4 sm:px-6 py-3 font-inter rounded-b-xl">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition duration-300">
        <Link to="/">HotelVista</Link>{" "}
        {/* Changed logo text for better branding */}
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
        {/* Add more links as needed */}
      </div>

      {/* Right: Buttons */}
      <div className="space-x-2 sm:space-x-4 flex items-center">
        {/* Login Button */}
        <Link to="/login">
          {" "}
          {/* Using Link for navigation */}
          <button
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-400 font-semibold
                             hover:bg-blue-900 hover:border-blue-500 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Login
          </button>
        </Link>
        {/* Signup Button */}
        <Link to="/signup">
          {" "}
          {/* Using Link for navigation */}
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold
                             bg-gradient-to-r from-blue-600 to-purple-600 shadow-md
                             hover:from-blue-700 hover:to-purple-700 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Signup
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
