import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeCard from "../../components/admin/EmployeeCard";
import Sidebar from "../../components/admin/Sidebar";


const Employees = () => {
   const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      const jwtToken = localStorage.getItem("jwtToken");

      if (jwtToken) {
      } else {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        // Optionally redirect to login page if token is missing
        navigate("/");
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/api/epmloyee', {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass the JWT token
          },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError("Failed to load employee data. Please try again later.");
        // Handle specific errors, e.g., 401 Unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Hotel Employees</h2>

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
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200">
                  + Add New Employee
                </button>
              </div>
              {employees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((emp) => (
                    <EmployeeCard key={emp._id} employee={emp} /> // Use _id for key
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
