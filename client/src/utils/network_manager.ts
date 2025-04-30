import axios from "axios";

const timeOut = 120000;

export const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: import.meta.env.VITE_NETWORK_TIMEOUT ?? timeOut,
});
