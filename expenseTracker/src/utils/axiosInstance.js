// import axios from 'axios';

// Since your backend serves both frontend and API from same URL
const isProduction = window.location.hostname.includes('onrender.com') || 
                    window.location.hostname.includes('netlify.app') ||
                    window.location.hostname.includes('vercel.app') ||
                    !window.location.hostname.includes('localhost');

// Use SAME domain for API calls since backend and frontend are on same service
const API_URL = isProduction
  ? `${window.location.origin}/api/v1`  // Same domain as frontend!
  : "http://localhost:8080/api/v1";

console.log('🌐 Environment Detection:');
console.log('- Hostname:', window.location.hostname);
console.log('- Origin:', window.location.origin);
console.log('- Is Production:', isProduction);
console.log('- API URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;