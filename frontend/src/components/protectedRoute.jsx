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
        const res = await api.get("user/is-admin/");
        setIsAdmin(res.data.is_admin);
      } catch (err) {
        console.error("Admin check failed", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkAdmin();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Checking permissions...
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
