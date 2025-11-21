// src/pages/Login.jsx → FINAL VERSION
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect already logged-in users
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual errors + server error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      // This now works perfectly with our updated AuthContext.login(token, user)
      await login(token, user);

      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid username or password";

      setServerError(message);

      // Auto-clear server error after 6s
      setTimeout(() => setServerError(""), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <img src={logo} alt="Logo" className="h-20 mx-auto mb-6" />

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center animate-pulse">
            <strong>{serverError}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline transition"
            >
              Sign up
            </Link>
          </p>
          {/* Optional: Add "Forgot password?" link later */}
        </div>
      </div>
    </div>
  );
};

export default Login;