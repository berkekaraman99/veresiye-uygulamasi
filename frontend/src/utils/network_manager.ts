import axios from "axios";

const timeOut = import.meta.env.VITE_NETWORK_TIMEOUT ?? 120000;
const baseURL = import.meta.env.VITE_NETWORK_BASE_URL ?? "http://localhost:3000/api";

export const instance = axios.create({
  baseURL: baseURL,
  timeout: timeOut,
});
