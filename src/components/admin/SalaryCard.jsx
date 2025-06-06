// src/components/admin/SalaryCard.jsx
import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for the Edit button

const SalaryCard = ({ salary, onDelete }) => { // Accept onDelete prop
  const navigate = useNavigate();

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "Overdue":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const amount = salary.amount || 0;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col transform hover:scale-102 transition-all duration-300 ease-in-out">
      <h3 className="text-2xl font-bold text-blue-400 mb-2">
        {salary.employee ? `${salary.employee.firstName} ${salary.employee.lastName}` : "Unknown Employee"}
      </h3>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Position:</span> {salary.employee?.position || 'N/A'}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Email:</span> {salary.employee?.email || 'N/A'}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Period:</span> {format(parseISO(salary.startDate), 'MMM dd, yyyy')} - {format(parseISO(salary.endDate), 'MMM dd, yyyy')}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Amount:</span> <span className="font-bold text-green-400">₹{amount.toLocaleString('en-IN')}</span>
      </p>
      <p className="text-gray-300 mb-4">
        <span className="font-semibold text-white">Payment Status:</span>{" "}
        <span className={`font-bold ${getPaymentStatusColor(salary.status)}`}>
          {salary.status}
        </span>
      </p>
      {salary.paymentDate && (
        <p className="text-gray-300 text-sm mt-auto">
          <span className="font-semibold text-white">Paid On:</span> {format(parseISO(salary.paymentDate), 'PPP')}
        </p>
      )}
      {salary.notes && (
        <p className="text-gray-400 text-sm italic mt-2">
          <span className="font-semibold text-white">Notes:</span> {salary.notes}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => navigate(`/admin/salaries/edit/${salary._id}`)} // Navigate to edit route
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(salary._id)} // Call onDelete prop with salary ID
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Delete
        </button>
        {salary.status === 'Pending' && (
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default SalaryCard;
