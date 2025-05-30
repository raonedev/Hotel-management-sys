import React, { useState } from "react";
import HeroImage from "../../assets/Hero.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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
    <div className="flex w-full min-h-screen">
      <div className="w-1/2 hidden md:block">
        <img
          src={HeroImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black">Sign Up</h2>
          </div>

          <div>
            <label className="block text-gray-700 text-left">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm text-left mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-left">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm text-left mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-left">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm text-left mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              Link to="/login"
              className="text-blue-500 underline ml-4"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
