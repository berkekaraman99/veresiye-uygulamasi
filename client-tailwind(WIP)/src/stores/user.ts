import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";

export const useUserStore = defineStore("user", () => {
  //STATES
  const user = ref(null);
  const accessToken = ref<string>("");
  const expiration = ref<string>("");
  const statusCode = ref(0);

  //ACTIONS
  async function login(user: any) {
    try {
      const response = await instance.post("/auth/login", user);
      console.log(response);
      statusCode.value = response.data.statusCode;
      if (response.data.statusCode === 200) {
        accessToken.value = response.data.data.accessToken;
        instance.defaults.headers["Authorization"] = `Bearer ${accessToken.value}`;

        await instance.get("/auth/getUserAfterLogin").then((res) => {
          user.value = res.data.data;
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 3000);
    }
  }

  async function signup(user: any) {
    try {
      const response = await instance.post("/auth/signup", user);
      console.log(response);
      statusCode.value = response.data.statusCode;
      if (response.data.statusCode === 200) {
        accessToken.value = response.data.data.accessToken;
        instance.defaults.headers["Authorization"] = `Bearer ${accessToken.value}`;

        await instance.get("/auth/getUserAfterLogin").then((res) => {
          user.value = res.data.data;
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 3000);
    }
  }

  return { user, accessToken, statusCode, login, signup };
});
