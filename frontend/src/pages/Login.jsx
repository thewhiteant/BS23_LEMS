// src/components/LoginPage.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import api from "../services/api";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("login/", {
      username: username,
      password: password
    });

    localStorage.setItem("access_token", response.data.tokens.access);
    localStorage.setItem("refresh_token", response.data.tokens.refresh);

    setMessage("Login successful!");
    window.location.href = "/";
  } catch (error) {
    console.log(error.response?.data);
    setMessage("Login failed. Check username or password.");
  }
};













  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-21 w-30 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account? <a href="#" className="text-blue-500"> <Link to="/signup">Sign up</Link></a>
        </p>
        <p className="text-sm text-gray-500 text-center mt-4">
           <a href="#" className="text-blue-500"> <Link to="/">forgot password</Link></a>
        </p>
      </div>




    </div>
  );
};

export default Login;
