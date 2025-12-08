import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Endpoints that don’t require authentication
const noAuthEndpoints = [
  "user/register/",
  "user/login/",
  "rsvp/guest-register/",
];

// Attach access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    const isPublic = noAuthEndpoints.some((url) => config.url.includes(url));

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Call your refresh endpoint
        const refreshResponse = await axios.post(
          "http://localhost:8000/user/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
