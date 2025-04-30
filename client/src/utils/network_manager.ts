import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3000/api",
<<<<<<< HEAD
  timeout: import.meta.env.VITE_NETWORK_TIMEOUT ?? timeOut,
=======
  timeout: 120000,
>>>>>>> d3afb1a3581f8b2ed04c458c1b3a64fe64cc9e20
});
