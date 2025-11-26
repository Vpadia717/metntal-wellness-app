import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
