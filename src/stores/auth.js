import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem("auth_token"));
  const isAuthenticated = computed(() => !!token.value);

  // Hardcoded credentials for simplicity
  const validCredentials = {
    admin: "password",
    user: "123456",
    demo: "demo123",
  };

  // Actions
  const login = async (username, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (validCredentials[username] && validCredentials[username] === password) {
      const userData = {
        id: 1,
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: username === "admin" ? "admin" : "user",
      };

      const authToken = btoa(`${username}:${password}`); // Simple base64 encoding

      user.value = userData;
      token.value = authToken;
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("user_data", JSON.stringify(userData));

      return userData;
    } else {
      throw new Error("Invalid username or password");
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  const initializeAuth = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticated,

    // Actions
    login,
    logout,
    initializeAuth,
  };
});
