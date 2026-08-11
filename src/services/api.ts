import axios from "axios";

const api = axios.create({

  // baseURL: "http://localhost:5151/api",
  // baseURL: "http://localhost:8085/api", // IIS
  baseURL: "https://niyatphysio-api.shop/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;