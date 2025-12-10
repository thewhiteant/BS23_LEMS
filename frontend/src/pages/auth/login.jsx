import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import PopupAlert from "../../components/popupAlert";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ visible: false, message: "", type: "info" });

    try {
      const response = await api.post("user/login/", { username, password });
      const { access, refresh, user } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      setAlert({
        visible: true,
        message: "Login successful!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error.response?.data);

      setAlert({
        visible: true,
        message:
          error.response?.data?.non_field_errors?.[0] ||
          "Invalid username or password.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-200">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-25 w-35 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login to Your Account
        </h2>

        {alert.visible && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, visible: false })}
            duration={3000}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-gray-400 text-center mt-2">
          <Link to="/forgot" className="text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
