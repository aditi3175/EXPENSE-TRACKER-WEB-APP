import axios from "axios";

const isProduction =
  window.location.hostname.includes("onrender.com") ||
  window.location.hostname.includes("netlify.app") ||
  window.location.hostname.includes("vercel.app");

const API_URL = isProduction
  ? `${window.location.origin}/api/v1` 
  : "http://localhost:8080/api/v1";

console.log("🌐 Environment Detection:");
console.log("- Hostname:", window.location.hostname);
console.log("- Origin:", window.location.origin);
console.log("- Is Production:", isProduction);
console.log("- API URL:", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.baseURL + config.url);
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.data);
    return response;
  },

  (error) => {
    if (error.response) {
      // Server responded with a status code
      console.error(
        "Response error (server):",
        error.response.status,
        error.response.data
      );

      if (error.response.status === 401) {
        // Unauthorized - remove token and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.request) {
      // Request made but no response received
      console.error(
        "No response received (network/CORS issue):",
        error.request
      );
    } else {
      // Something else went wrong
      console.error("Axios error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
