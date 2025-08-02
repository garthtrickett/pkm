// src/main.ts
import "./styles/index.css";
import "./components/layouts/app-shell.ts";
import { jwtDecode } from "jwt-decode";
import {
  initializeAuthStore,
  proposeAuthAction,
} from "./lib/client/stores/authStore";
import type { UserId } from "./lib/shared/schemas";

// Initialize the store's background process
initializeAuthStore();

// --- Enhanced Initial Authentication Check ---

const token = localStorage.getItem("jwt");

if (!token) {
  // If there's no token, we know the user is unauthenticated.
  proposeAuthAction({ type: "SET_UNAUTHENTICATED" });
} else {
  try {
    const decoded = jwtDecode<{ sub: UserId; exp: number }>(token);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      // Token is expired, remove it and set state to unauthenticated.
      localStorage.removeItem("jwt");
      proposeAuthAction({ type: "SET_UNAUTHENTICATED" });
    } else {
      // Token exists and is not expired, so verify it with the server.
      proposeAuthAction({ type: "AUTH_CHECK_START" });
    }
  } catch (error) {
    // Token is malformed, remove it and set state to unauthenticated.
    console.error("Failed to decode JWT:", error);
    localStorage.removeItem("jwt");
    proposeAuthAction({ type: "SET_UNAUTHENTICATED" });
  }
}
