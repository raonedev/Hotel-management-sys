import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling

const Sidebar = () => {
  const location = useLocation(); // Get current location to highlight active link

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Rooms", path: "/admin/rooms" },
    { name: "Employees", path: "/admin/employees" },
    { name: "Salaries", path: "/admin/salaries" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-100 p-6 flex flex-col shadow-lg border-r border-gray-800">
      <h1 className="text-3xl font-extrabold text-blue-400 mb-8 text-center">Admin Panel</h1>
      <nav className="space-y-4 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            // Apply active styles if the current path matches the item's path
            className={`block py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200
                        ${location.pathname === item.path
                          ? "bg-blue-600 text-white shadow-md" // Active link styles
                          : "hover:bg-gray-700 hover:text-blue-300" // Inactive link hover styles
                        }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      {/* Optional: Add a logout button or user info at the bottom */}
      <div className="mt-auto pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-sm">Logged in as Admin</p>
        <button
          onClick={() => {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userRole");
            // Perform actual logout logic, e.g., redirect to login
            window.location.href = "/"; // Consider using navigate('/') here as well
          }}
          className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg shadow-md
                     hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;