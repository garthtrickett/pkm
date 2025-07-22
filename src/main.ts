// src/main.ts
import "./styles/index.css";
import "./components/layouts/app-shell.ts";
// Import proposeAuthAction
import {
  initializeAuthStore,
  proposeAuthAction,
} from "./lib/client/stores/authStore";

// Initialize the store's process
initializeAuthStore();
// Explicitly start the first auth check
proposeAuthAction({ type: "AUTH_CHECK_START" });
