import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await api.post("user/register/", {
        username,
        email,
        password,
        password_confirm: confirmPassword,
        phone,
      });

      setMessage("Signup successful!");

      // Clear fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");

      // Redirect
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err); // Just log error, no formatting
      setMessage("Something went wrong"); // Simple message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-200">

        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-25 w-35 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Create Your Account
        </h2>

        {message && <p className="text-center mb-4 text-red-400">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Confirm password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Enter phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
