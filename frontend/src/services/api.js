// src/services/api.js
import axios from "axios";

// Main API instance
const api = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Separate axios instance for refresh token request
const refreshApi = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
});

// ---------------------
// REQUEST INTERCEPTOR
// ---------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------
// RESPONSE INTERCEPTOR
// ---------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshApi.post("token/refresh/");
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
