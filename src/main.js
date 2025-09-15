import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";

// Import pages
import GrowthSummary from "./pages/GrowthSummary.vue";
import AssetInput from "./pages/AssetInput.vue";
import DebtData from "./pages/DebtData.vue";
import Login from "./pages/Login.vue";

// Import components
import Layout from "./components/Layout.vue";
import ProtectedRoute from "./components/ProtectedRoute.vue";

const routes = [
  {
    path: "/",
    component: ProtectedRoute,
    children: [
      { path: "", redirect: "/growth" },
      { path: "growth", name: "GrowthSummary", component: GrowthSummary },
      { path: "input", name: "AssetInput", component: AssetInput },
      { path: "debt", name: "DebtData", component: DebtData },
    ],
  },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.component("Layout", Layout);
app.component("ProtectedRoute", ProtectedRoute);
app.mount("#app");
