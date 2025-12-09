import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import { useLocation, useNavigate, Link, replace } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hidden user info from ForgotPassword
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/"); // redirect to home
    }
  }, [email, navigate]);

  // Step 1: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("user/verify-otp/", { email, otp });
      setMessage("OTP verified. You can now reset your password.");
      setOtpVerified(true);
    } catch (err) {
      setMessage("Invalid OTP.");
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await api.post("user/reset-password/", {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Password reset successful! You can now login.");
      setNewPassword("");
      setConfirmPassword("");
      setOtpVerified(false);
      setOtp("");
      navigate("/", replace);
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

        {message && (
          <p className="text-center mb-4 text-green-400">{message}</p>
        )}

        {/* Step 1: OTP input */}
        {!otpVerified && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Enter OTP</label>
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
                placeholder="Enter OTP"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 2: New password */}
        {otpVerified && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
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
        )}

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
