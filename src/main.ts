// src/main.ts
import { Effect } from "effect";
import { mainEffect } from "./client"; // Import the effect

const appDiv = document.getElementById("app")!;

// Run the effect and update the DOM
Effect.runPromise(mainEffect).then(
  (response) => {
    appDiv.innerText = `✅ Server responded: ${response}`;
    console.info("Success:", response);
  },
  (error) => {
    // Safely check for the _tag property before accessing it.
    const tag =
      typeof error === "object" && error && "_tag" in error
        ? String((error as { _tag: unknown })._tag)
        : "UnknownError";

    appDiv.innerText = `❌ Error: ${tag}`;
    console.error("Error:", error);
  },
);
