// src/pages/admin/Employees.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeCard from "../../components/admin/EmployeeCard"; // Make sure this path is correct
import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // New state for delete success, not used yet
  const navigate = useNavigate();


  // Function to fetch employees (can be called from useEffect and after delete)
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) { // Changed condition for clarity
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate("/"); // Redirect to login page if token is missing
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/api/epmloyee', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        // localStorage.removeItem("userRole"); // Clear user role if stored
        navigate("/");
      } else {
        setError("Failed to load employee data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // Run once on mount to fetch initial employees

  // Function to handle employee deletion
  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      return; // User cancelled
    }
    console.log('Deleting employee with ID:', employeeId);
    setLoading(true); // Show loading while deleting
    setDeleteSuccess(false); // Clear previous success messages

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      // Corrected URL to match the provided structure for employee deletion
      // Assuming employee deletion API is http://localhost:3000/api/epmloyee/:id
      console.log(`http://localhost:3000/api/epmloyee/${employeeId}`);
      console.log(`Bearer ${jwtToken}`);
      await axios.delete(`http://localhost:3000/api/epmloyee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setDeleteSuccess(true); // Set success message
      fetchEmployees(); // Re-fetch employees to update the list
      setTimeout(() => setDeleteSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error('Failed to delete employee:', err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to delete employee. Please try again.");
      }
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Hotel Employees</h2>

          {/* Delete success message */}
          {deleteSuccess && (
            <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
              <p>Employee deleted successfully!</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-blue-400 text-xl">Loading employees...</p>
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
                  onClick={() => navigate('/admin/employees/add')}
                >
                  + Add New Employee
                </button>
              </div>
              {employees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((emp) => (
                    <EmployeeCard
                      key={emp._id}
                      employee={emp}
                      onDelete={handleDeleteEmployee} // Pass the delete handler to EmployeeCard
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                  <p className="text-xl text-gray-400">No employees found.</p>
                  <p className="text-gray-500 mt-2">Start by adding a new employee to the system.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;