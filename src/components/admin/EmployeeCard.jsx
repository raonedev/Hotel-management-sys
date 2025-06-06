// src/components/admin/EmployeeCard.jsx
import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ employee, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-red-500";
      case "On Leave":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const salary = employee.salary || 0; // Safely get salary value

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col transform hover:scale-102 transition-all duration-300 ease-in-out">
      <h3 className="text-2xl font-bold text-blue-400 mb-2">{employee.firstName} {employee.lastName}</h3>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Position:</span> {employee.position}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Email:</span> {employee.email}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Phone:</span> {employee.phoneNumber}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Salary:</span> ₹{salary.toLocaleString('en-IN')}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Status:</span>{" "}
        <span className={`font-bold ${getStatusColor(employee.status)}`}>
          {employee.status}
        </span>
      </p>
      <p className="text-gray-300 mb-4">
        <span className="font-semibold text-white">Hire Date:</span> {format(parseISO(employee.hireDate), 'PPP')}
      </p>

      {employee.address && (
        <div className="mb-4 text-gray-300">
          <span className="font-semibold text-white">Address:</span>
          <p>{employee.address.street}</p>
          <p>{employee.address.city}, {employee.address.state} {employee.address.zipCode}</p>
          <p>{employee.address.country}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex justify-end space-x-3">
        <button
          onClick={() => navigate(`/admin/salaries/add?employeeId=${employee._id}&employeeName=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Add Salary
        </button>
        <button
          onClick={() => navigate(`/admin/employees/edit/${employee._id}`)} // Navigate to edit route
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(employee._id)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;