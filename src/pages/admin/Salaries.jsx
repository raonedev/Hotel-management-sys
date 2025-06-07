// src/pages/admin/Salaries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns'; // For better date formatting
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/NavBar"; // Assuming you want Navbar here
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

import SalaryCard from "../../components/admin/SalaryCard"; 

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // New state for delete success message
  const navigate = useNavigate();


  // Function to fetch salaries (can be called from useEffect and after delete)
  const fetchSalaries = async () => {
    setLoading(true);
    setError(null);
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate("/"); // Redirect to login page if token is missing
      return;
    }

    try {
      const res = await axios.get('https://hotel-management-sys-backend-production.up.railway.app/api/salary', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setSalaries(res.data);
    } catch (err) {
      console.error('Failed to fetch salaries:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized access. Please log in again.");
        localStorage.removeItem("jwtToken");
        // localStorage.removeItem("userRole"); // Clear user role if stored
        navigate("/");
      } else {
        setError("Failed to load salary data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []); // Run once on mount to fetch initial salaries

  // Function to handle salary deletion
  const handleDeleteSalary = async (salaryId) => {
    if (!window.confirm("Are you sure you want to delete this salary record? This action cannot be undone.")) {
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
      await axios.delete(`https://hotel-management-sys-backend-production.up.railway.app/api/salary/${salaryId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setDeleteSuccess(true); // Set success message
      fetchSalaries(); // Re-fetch salaries to update the list
      setTimeout(() => setDeleteSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error('Failed to delete salary:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to delete salary. Please try again.");
      }
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Employee Salaries</h2>

          {/* Delete success message */}
          {deleteSuccess && (
            <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
              <p>Salary record deleted successfully!</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-blue-400 text-xl">Loading salaries...</p>
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
                  onClick={() => navigate('/admin/salaries/add')}
                >
                  + Add New Salary Record
                </button>
              </div>
              {salaries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salaries.map((salary) => (
                    <SalaryCard
                      key={salary._id}
                      salary={salary}
                      onDelete={handleDeleteSalary} // Pass the delete handler to SalaryCard
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                  <p className="text-xl text-gray-400">No salary records found.</p>
                  <p className="text-gray-500 mt-2">Add new salary records to get started.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Salaries;
