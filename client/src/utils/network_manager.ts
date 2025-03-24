import axios from "axios";
import { useUserStore } from "@/stores/user";

export const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 120000,
});

instance.interceptors.request.use(function (config) {
  const userStore = useUserStore();
  config.headers.Authorization = `Bearer ${userStore.$state.accessToken}`;
  return config;
});
