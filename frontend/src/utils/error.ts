import axios from "axios";

// AXIOS ERROR CATCHER
export const getErrorMessage = (
  e: unknown,
  fallback = "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz",
) => (axios.isAxiosError(e) && e.response?.data?.message) || fallback;
