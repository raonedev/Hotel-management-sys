import React, { useState } from "react";
import HeroImage from "../../assets/Hero.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Signup successful:", { email, password });
      // Proceed with signup logic
    }
  };

  return (
     // Main container with dark background and Inter font
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-950 font-inter text-gray-100">
      {/* Left section for the hero image - hidden on small screens */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={HeroImage}
          alt="Signup Cover"
          className="w-full h-full object-cover rounded-r-2xl shadow-lg" // Added rounded corners and shadow
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x1000/1F2937/D1D5DB?text=Signup+Image+Not+Found"; }}
        />
      </div>

      {/* Right section for the signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-white mb-2">Join Us!</h2>
            <p className="text-gray-400 text-lg">Create your new account</p>
          </div>

          {/* Email input field */}
          <div>
            <label className="block text-gray-300 text-left text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm text-left mt-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-gray-300 text-left text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm text-left mt-2">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password input field */}
          <div>
            <label className="block text-gray-300 text-left text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm text-left mt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>
           {/* Admin checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isAdmin"
              className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="isAdmin" className="ml-2 text-gray-300 text-sm font-medium">
              Are you an admin?
            </label>
          </div>


          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-semibold rounded-lg
                       bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                       transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 underline font-medium transition duration-200">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
