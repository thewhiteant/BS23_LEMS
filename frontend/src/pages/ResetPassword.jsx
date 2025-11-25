// src/components/ResetPassword.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import api from "../services/api";
import { useParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { token } = useParams(); // assuming the reset token comes from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await api.post("reset-password/", {
        token,
        password,
        password_confirm: confirmPassword,
      });
      setMessage("Password reset successful! You can now login.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-200">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-25 w-35 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Reset Password
        </h2>
        {message && <p className="text-center mb-4 text-green-400">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          Back to{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
