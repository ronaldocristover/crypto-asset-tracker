import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

// Import pages
import GrowthSummary from "./pages/GrowthSummary.vue";
import AssetInput from "./pages/AssetInput.vue";
import DebtData from "./pages/DebtData.vue";

// Import components
import Layout from "./components/Layout.vue";

const routes = [
  { path: "/", redirect: "/growth" },
  { path: "/growth", name: "GrowthSummary", component: GrowthSummary },
  { path: "/input", name: "AssetInput", component: AssetInput },
  { path: "/debt", name: "DebtData", component: DebtData },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.component("Layout", Layout);
app.mount("#app");
