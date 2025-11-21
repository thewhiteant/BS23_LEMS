// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";
// import api from "../services/api";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // On app start — restore session
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       try {
//         const decoded = jwtDecode(savedToken);
//         const now = Date.now() / 1000;

//         if (decoded.exp < now) {
//           logout();
//         } else {
//           setToken(savedToken);
//           setUser(decoded);
//           api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
//         }
//       } catch (err) {
//         logout();
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Modified login: now accepts username/password OR token+user
//   const login = async (usernameOrToken, passwordOrUser) => {
//     // Case 1: Called from Login/Signup with credentials
//     if (passwordOrUser && typeof passwordOrUser === "string") {
//       const response = await api.post("/auth/login", {
//         username: usernameOrToken,
//         password: passwordOrUser,
//       });

//       const { token: jwtToken, user: userData } = response.data;
//       const decoded = jwtDecode(jwtToken);

//       localStorage.setItem("token", jwtToken);
//       setToken(jwtToken);
//       setUser(userData || decoded);
//       api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

//       return { success: true };
//     }

//     // Case 2: Called directly with token (rare)
//     if (typeof usernameOrToken === "string" && !passwordOrUser) {
//       const decoded = jwtDecode(usernameOrToken);
//       localStorage.setItem("token", usernameOrToken);
//       setToken(usernameOrToken);
//       setUser(passwordOrUser || decoded);
//       api.defaults.headers.common["Authorization"] = `Bearer ${usernameOrToken}`;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     delete api.defaults.headers.common["Authorization"];
//     navigate("/login", { replace: true });
//   };

//   const value = {
//     user,
//     token,
//     login,
//     logout,
//     isAuthenticated: !!token,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ProtectedRoute stays the same as before
// export const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate("/login", { replace: true });
//     }
//   }, [isAuthenticated, loading, navigate]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!isAuthenticated) return null;

//   return children;
// };