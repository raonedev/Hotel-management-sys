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
            <h2 className="text-3xl font-bold text-black">Login</h2>
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

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            {/* <a href="#" className="text-blue-500 underline"> */}
            <Link to="/signup" className="text-blue-500 underline">Signup</Link>
              
            
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
