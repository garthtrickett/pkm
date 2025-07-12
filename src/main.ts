// src/main.ts
import { Effect } from "effect";
import { mainEffect } from "./client"; // Import the effect

const appDiv = document.getElementById("app")!;

// Run the effect and update the DOM
Effect.runPromise(mainEffect).then(
  (response) => {
    appDiv.innerText = `✅ Server responded: ${response}`;
    console.log("Success:", response);
  },
  (error) => {
    appDiv.innerText = `❌ Error: ${error._tag}`;
    console.error("Error:", error);
  },
);
