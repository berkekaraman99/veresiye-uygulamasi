import axios from "axios";

export const instance = axios.create({
  timeout: import.meta.env.VITE_NETWORK_TIMEOUT ?? 120000,
  baseURL: import.meta.env.VITE_NETWORK_BASE_URL ?? "http://localhost:3000/api",
});

// instance.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// instance.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) window.location.hash = "#/login";
//     return Promise.reject(error);
//   },
// );
