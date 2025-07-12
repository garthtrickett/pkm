// src/main.ts
import { BrowserRuntime } from "@effect/platform-browser";
import { mainEffect } from "./client";

// Run the application using the idiomatic BrowserRuntime
BrowserRuntime.runMain(mainEffect);
