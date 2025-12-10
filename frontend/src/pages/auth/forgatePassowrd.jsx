import React, { useState } from "react";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import PopupAlert from "../../components/popupAlert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info",
  });
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("user/forgot-password/", { email });

      setAlert({
        visible: true,
        message: res.data.message || "OTP sent to your email.",
        type: "success",
      });

      setTimeout(() => navigate("/reset", { state: { email } }), 1000);
    } catch (errors) {
      const message =
        (errors?.email && errors.email) ||
        (errors?.non_field_errors && errors.non_field_errors[0]) ||
        "Something went wrong. Try again.";

      setAlert({
        visible: true,
        message,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {alert.visible && (
        <PopupAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-200">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-25 w-35 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Forgot Password
        </h2>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-100"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
