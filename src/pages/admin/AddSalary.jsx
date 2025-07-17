import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from "../../components/NavBar";
import Sidebar from "../../components/admin/Sidebar";
import { format, parseISO } from 'date-fns';

const AddSalary = () => {
  const navigate = useNavigate();
  const { id: salaryId } = useParams(); // Get salary ID from URL parameters for edit mode
  const location = useLocation(); // For query parameters when adding a new salary

  const [formData, setFormData] = useState({
    employee: '', // Will store employee ID
    amount: '',
    startDate: '',
    endDate: '',
    status: 'Paid',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingSalary, setLoadingSalary] = useState(true); // For loading existing salary data
  const [salaryFetchError, setSalaryFetchError] = useState(null);
  const [employees, setEmployees] = useState([]); // To populate the employee dropdown
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeeDropdownError, setEmployeeDropdownError] = useState(null);


  // Fetch all employees for the dropdown
  useEffect(() => {
    const fetchEmployeesForDropdown = async () => {
      setLoadingEmployees(true);
      setEmployeeDropdownError(null);
      const jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
        setEmployeeDropdownError("Authentication token not found. Please log in.");
        setLoadingEmployees(false);
        navigate("/");
        return;
      }

      try {
        const res = await axios.get('https://hotel-management-sys-backend.vercel.app/api/epmloyee', {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees for dropdown:', err);
        setEmployeeDropdownError("Failed to load employees for selection.");
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployeesForDropdown();
  }, [navigate]);

  // Effect to check login status and fetch salary data if in edit mode
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
    } else {
      navigate("/");
      return;
    }

    // Parse query parameters for initial employee selection (for Add mode)
    const queryParams = new URLSearchParams(location.search);
    const initialEmployeeId = queryParams.get('employeeId');
    // const initialEmployeeName = queryParams.get('employeeName'); // Not directly used for form data

    if (salaryId) { // Edit mode: fetch existing salary
      const fetchSalary = async () => {
        setLoadingSalary(true);
        setSalaryFetchError(null);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
          const res = await axios.get(`https://hotel-management-sys-backend.vercel.app/api/salary/${salaryId}`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
          const salaryData = res.data;
          setFormData({
            employee: salaryData.employee?._id || salaryData.employee, // Can be object or ID
            amount: salaryData.amount || '',
            startDate: salaryData.startDate ? format(parseISO(salaryData.startDate), 'yyyy-MM-dd') : '',
            endDate: salaryData.endDate ? format(parseISO(salaryData.endDate), 'yyyy-MM-dd') : '',
            status: salaryData.status || 'Paid',
            notes: salaryData.notes || '',
          });
        } catch (err) {
          console.error('Failed to fetch salary details:', err);
          if (err.response && err.response.status === 401) {
            setSalaryFetchError("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("jwtToken");
            navigate("/");
          } else {
            setSalaryFetchError(err.response?.data?.message || "Failed to load salary details.");
          }
        } finally {
          setLoadingSalary(false);
        }
      };
      fetchSalary();
    } else { // Add mode: populate with initial employee if present
      setFormData(prevData => ({
        ...prevData,
        employee: initialEmployeeId || '', // Set employee if passed via query param
      }));
      setLoadingSalary(false); // No existing salary to load
    }
  }, [salaryId, navigate, location.search]); // Rerun when ID or location changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
        amount: parseFloat(formData.amount), // Ensure amount is a number
        // Convert dates to ISO strings (or ensure they are already in the correct format)
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };

      let res;
      if (salaryId) {
        // If salaryId exists, it's an EDIT (PUT request)
        const editPayload = { ...payload, _id: salaryId }; // Include _id in payload as per example
        res = await axios.put(`https://hotel-management-sys-backend.vercel.app/api/salary/${salaryId}`, editPayload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // If no salaryId, it's an ADD (POST request)
        res = await axios.post('https://hotel-management-sys-backend.vercel.app/api/salary', payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (res.status === 200 || res.status === 201) { // 200 for PUT, 201 for POST
        setSubmitSuccess(true);
        if (!salaryId) { // Only reset form if it was an add operation
          setFormData({
            employee: '',
            amount: '',
            startDate: '',
            endDate: '',
            status: 'Paid',
            notes: '',
          });
        }
        setTimeout(() => {
          navigate('/admin/salaries'); // Navigate back to salaries list (you'll need to create this page)
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to save salary:', err);
      if (err.response && err.response.status === 401) {
        setSubmitError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        // Handles the generic server error message
        setSubmitError(err.response?.data?.message || "Failed to save salary. Please check your inputs.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading/error states for fetching existing salary data or employees
  if (salaryId && loadingSalary) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-blue-400 text-xl">Loading salary details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (salaryId && salaryFetchError) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="bg-red-800 p-4 rounded-lg shadow-md text-red-100 text-center text-lg">
              <p>{salaryFetchError}</p>
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
            {salaryId ? 'Edit Salary Record' : 'Add New Salary'}
          </h2>

          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Employee Selection */}
              <div>
                <label htmlFor="employee" className="block text-gray-300 text-lg font-semibold mb-2">
                  Employee:
                </label>
                {loadingEmployees ? (
                  <p className="text-gray-400">Loading employees...</p>
                ) : employeeDropdownError ? (
                  <p className="text-red-400">{employeeDropdownError}</p>
                ) : (
                  <select
                    id="employee"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    required
                    disabled={!!salaryId} // Disable selection in edit mode
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.position})
                      </option>
                    ))}
                  </select>
                )}
                {salaryId && formData.employee && (
                  <p className="text-gray-400 text-sm mt-1">
                    Employee cannot be changed in edit mode.
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-gray-300 text-lg font-semibold mb-2">
                  Amount:
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-gray-300 text-lg font-semibold mb-2">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-gray-300 text-lg font-semibold mb-2">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-gray-300 text-lg font-semibold mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-gray-300 text-lg font-semibold mb-2">
                  Notes:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-800 p-3 rounded-lg shadow-md text-red-100 text-center mb-4">
                <p>{submitError}</p>
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-700 p-3 rounded-lg shadow-md text-green-100 text-center mb-4">
                <p>Salary {salaryId ? 'updated' : 'added'} successfully!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || (salaryId && loadingSalary) || loadingEmployees}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors duration-200
                ${submitting || (salaryId && loadingSalary) || loadingEmployees
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
            >
              {submitting
                ? (salaryId ? 'Updating Salary...' : 'Adding Salary...')
                : (salaryId ? 'Update Salary' : 'Add Salary')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;
