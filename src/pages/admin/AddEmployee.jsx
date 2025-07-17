// src/pages/admin/AddEmployee.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import Sidebar from "../../components/admin/Sidebar";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get employee ID from URL parameters

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: 'Receptionist',
    salary: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(true); // New state for loading employee data
  const [employeeFetchError, setEmployeeFetchError] = useState(null); // New state for employee fetch errors


  // Effect to check login status and fetch employee data if in edit mode
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
    } else {
      navigate("/"); // Redirect to home/login page if no token
      return;
    }

    // If an ID is present, fetch employee data for editing
    if (id) {
      const fetchEmployee = async () => {
        setLoadingEmployee(true);
        setEmployeeFetchError(null);
        setSubmitError(null); // Clear any previous submit errors
        setSubmitSuccess(false); // Clear any previous submit success messages

        try {
          const res = await axios.get(`https://hotel-management-sys-backend.vercel.app/api/epmloyee/${id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          // Populate form data with fetched employee details
          const employeeData = res.data;
          setFormData({
            firstName: employeeData.firstName || '',
            lastName: employeeData.lastName || '',
            email: employeeData.email || '',
            phoneNumber: employeeData.phoneNumber || '',
            position: employeeData.position || 'Receptionist',
            salary: employeeData.salary || '',
            address: {
              street: employeeData.address?.street || '',
              city: employeeData.address?.city || '',
              state: employeeData.address?.state || '',
              zipCode: employeeData.address?.zipCode || '',
              country: employeeData.address?.country || '',
            },
          });
        } catch (err) {
          console.error('Failed to fetch employee details:', err);
          if (err.response && err.response.status === 401) {
            setEmployeeFetchError("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("jwtToken");
            navigate("/");
          } else {
            setEmployeeFetchError(err.response?.data?.message || "Failed to load employee details.");
          }
        } finally {
          setLoadingEmployee(false);
        }
      };
      fetchEmployee();
    } else {
      setLoadingEmployee(false); // No ID, so not loading an existing employee
    }
  }, [id, navigate]); // Rerun when ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
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
        salary: parseFloat(formData.salary), // Ensure salary is a number
      };

      let res;
      if (id) {
        // If ID exists, it's an EDIT (PUT request)
        // Ensure the _id is also in the payload if your PUT API requires it
        const editPayload = { ...payload, _id: id };
        res = await axios.put(`https://hotel-management-sys-backend.vercel.app/api/epmloyee/${id}`, editPayload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // If no ID, it's an ADD (POST request)
        res = await axios.post('https://hotel-management-sys-backend.vercel.app/api/epmloyee', payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (res.status === 200 || res.status === 201) { // 200 for PUT, 201 for POST
        setSubmitSuccess(true);
        if (!id) { // Only reset form if it was an add operation
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            position: 'Receptionist',
            salary: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            },
          });
        }
        setTimeout(() => {
          navigate('/admin/employees'); // Navigate back to employees list
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to save employee:', err);
      if (err.response && err.response.status === 409) {
        setSubmitError(err.response.data.message || "Employee with this phone number already exists.");
      } else if (err.response && err.response.status === 401) {
        setSubmitError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        setSubmitError(err.response?.data?.message || "Failed to save employee. Please check your inputs.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading/error states for fetching existing employee data
  if (id && loadingEmployee) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
       
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-blue-400 text-xl">Loading employee details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (id && employeeFetchError) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
       
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="bg-red-800 p-4 rounded-lg shadow-md text-red-100 text-center text-lg">
              <p>{employeeFetchError}</p>
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
            {id ? 'Edit Employee Details' : 'Add New Employee'}
          </h2>

          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Details */}
              <div>
                <label htmlFor="firstName" className="block text-gray-300 text-lg font-semibold mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-300 text-lg font-semibold mb-2">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 text-lg font-semibold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-300 text-lg font-semibold mb-2">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Details */}
              <div>
                <label htmlFor="position" className="block text-gray-300 text-lg font-semibold mb-2">
                  Position:
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Manager">Manager</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Chef">Chef</option>
                  <option value="Concierge">Concierge</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label htmlFor="salary" className="block text-gray-300 text-lg font-semibold mb-2">
                  Salary:
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address Details */}
            <h3 className="text-xl font-bold text-white mb-4 mt-6">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="street" className="block text-gray-300 text-lg font-semibold mb-2">
                  Street:
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-gray-300 text-lg font-semibold mb-2">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-300 text-lg font-semibold mb-2">
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-gray-300 text-lg font-semibold mb-2">
                  Zip Code:
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-gray-300 text-lg font-semibold mb-2">
                  Country:
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-800 p-3 rounded-lg shadow-md text-red-100 text-center mb-4">
                <p>{submitError}</p>
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
                <p>Employee {id ? 'updated' : 'added'} successfully!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors duration-200
                ${submitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
            >
              {submitting ? (id ? 'Updating Employee...' : 'Adding Employee...') : (id ? 'Update Employee' : 'Add Employee')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;