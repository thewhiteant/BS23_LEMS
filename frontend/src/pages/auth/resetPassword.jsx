import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PopupAlert from "../../components/popupAlert";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("user/verify-otp/", { email, otp });

      showAlert(res.data.message || "OTP Verified!", "success");
      setOtpVerified(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid OTP!";
      showAlert(errorMsg, "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert("Passwords do not match!", "error");
      return;
    }

    try {
      const res = await api.post("user/reset-password/", {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      showAlert(res.data.message || "Password reset successful!", "success");

      setNewPassword("");
      setConfirmPassword("");
      setOtpVerified(false);
      setOtp("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to reset password!";
      showAlert(errorMsg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {alert.message && (
        <PopupAlert
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />
      )}

      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-200">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-25 w-35 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Reset Password
        </h2>

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
