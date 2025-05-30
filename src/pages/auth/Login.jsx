import React, { useState } from "react";
import HeroImage from "../../assets/Hero.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login successful:", { email, password });
    }
  };

  return (
      // Main container with dark background and Inter font
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-950 font-inter text-gray-100">
      {/* Left section for the hero image - hidden on small screens */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={HeroImage}
          alt="Login Cover"
          className="w-full h-full object-cover rounded-r-2xl shadow-lg" // Added rounded corners and shadow
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x1000/1F2937/D1D5DB?text=Login+Image+Not+Found"; }}
        />
      </div>

      {/* Right section for the login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-400 text-lg">Sign in to your account</p>
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

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-semibold rounded-lg
                       bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                       transform hover:-translate-y-0.5"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline font-medium transition duration-200">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
