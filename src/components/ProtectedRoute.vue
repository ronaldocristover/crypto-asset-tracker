<template>
  <div v-if="!isLoading">
    <Layout v-if="isAuthenticated">
      <router-view />
    </Layout>
    <Login v-else />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import Layout from "./Layout.vue";
import Login from "../pages/Login.vue";

export default {
  name: "ProtectedRoute",
  components: {
    Layout,
    Login,
  },
  setup() {
    const authStore = useAuthStore();
    const isLoading = ref(true);

    onMounted(async () => {
      // Initialize auth and check if user is logged in
      authStore.initializeAuth();
      isLoading.value = false;
    });

    return {
      isLoading,
      isAuthenticated: authStore.isAuthenticated,
    };
  },
};
</script>
