import axios from "axios";

const api = axios.create({
  baseURL: "https://bs23-lems.onrender.com/",
  // baseURL: "http://localhost:8000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const noAuthEndpoints = [
  "user/register/",
  "user/login/",
  "rsvp/guest-register/",
];

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          // "http://localhost:8000/user/token/refresh/",
          "https://bs23-lems.onrender.com/user/token/refresh/",
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
