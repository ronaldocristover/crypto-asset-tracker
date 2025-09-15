<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">
              Crypto Asset Tracker
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <nav class="hidden md:flex space-x-8">
              <router-link
                to="/growth"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'GrowthSummary' }"
              >
                Growth Summary
              </router-link>
              <router-link
                to="/input"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'AssetInput' }"
              >
                Add Assets
              </router-link>
              <router-link
                to="/debt"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'DebtData' }"
              >
                Debt Data
              </router-link>
            </nav>

            <!-- User info and logout -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600"
                >Welcome, {{ user?.name || "User" }}</span
              >
              <button
                @click="handleLogout"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          v-show="mobileMenuOpen"
          class="md:hidden border-t border-gray-200 bg-white"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link
              to="/growth"
              class="mobile-nav-link"
              :class="{
                'mobile-nav-link-active': $route.name === 'GrowthSummary',
              }"
              @click="mobileMenuOpen = false"
            >
              Growth Summary
            </router-link>
            <router-link
              to="/input"
              class="mobile-nav-link"
              :class="{
                'mobile-nav-link-active': $route.name === 'AssetInput',
              }"
              @click="mobileMenuOpen = false"
            >
              Add Assets
            </router-link>
            <router-link
              to="/debt"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.name === 'DebtData' }"
              @click="mobileMenuOpen = false"
            >
              Debt Data
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "Layout",
  setup() {
    const mobileMenuOpen = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    const user = computed(() => authStore.user);

    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };

    return {
      mobileMenuOpen,
      user,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
}

.nav-link-active {
  @apply text-primary-600 bg-primary-50;
}

.mobile-nav-link {
  @apply text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200;
}

.mobile-nav-link-active {
  @apply text-primary-600 bg-primary-50;
}
</style>
