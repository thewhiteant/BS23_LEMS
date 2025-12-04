// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("user/is-admin/"); // ✅ MATCHES YOUR URL
        setIsAdmin(res.data.is_admin);
      } catch (err) {
        console.error("Admin check failed", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Only check admin if user is logged in
    if (token) {
      checkAdmin();
    } else {
      setLoading(false);
    }
  }, [token]);

  // 🚫 Not logged in → login
  if (!token && !loading) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Loading state while checking role
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Checking permissions...
      </div>
    );
  }

  // 🚫 User trying to access admin → redirect to "/"
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
