// FILE: src/main.ts
import "./styles/index.css";
import "./components/layouts/app-shell.ts";
import {
  initializeAuthStore,
  proposeAuthAction,
} from "./lib/client/stores/authStore";

// Initialize the store's background process
initializeAuthStore();

// --- Initial Authentication Check ---
const token = localStorage.getItem("jwt");

// ✅ --- ADD THIS LOG --- ✅
console.log("🦖 [main.ts] Token from localStorage on startup:", token);

if (!token) {
  // If there's no token, we immediately know the user is unauthenticated.
  proposeAuthAction({ type: "SET_UNAUTHENTICATED" });
} else {
  // If a token exists, start the server-side validation process.
  // The UI will show a loading/authenticating state until this completes.
  proposeAuthAction({ type: "AUTH_CHECK_START" });
}
