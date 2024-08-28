import axios from "axios";
import { useUserStore } from "@/stores/user";

const timeOut: number = 60000;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_NETWORK_TIMEOUT ?? timeOut,
});

instance.interceptors.request.use(function (config) {
  const userStore = useUserStore();
  config.headers.Authorization = `Bearer ${userStore.$state.accessToken}`;
  return config;
});
