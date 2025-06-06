import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/NavBar";

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const jwtToken = localStorage.getItem("jwtToken");

    // Check authentication first
    if (!jwtToken) {
      console.log("No JWT token found, redirecting to home.");
      navigate("/"); // Redirect to home if not logged in
      return;
    }


    // Then check authorization (user role)
    if (userRole === "user") {
      console.log("User role detected, redirecting to home.");
      navigate("/"); // Redirect to home if user role is "user"
      return;
    }

    console.log("Admin user logged in and authorized.");
  }, [navigate]); // Add navigate to the dependency array



  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Admin Dashboard</h2>
          <p className="text-lg text-gray-300">Welcome to your administrative control panel.</p>

          {/* Add more dashboard content here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-400">1,234</p> {/* Placeholder data */}
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Available Rooms</h3>
              <p className="text-3xl font-bold text-green-400">75</p> {/* Placeholder data */}
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">New Enquiries</h3>
              <p className="text-3xl font-bold text-yellow-400">12</p> {/* Placeholder data */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;