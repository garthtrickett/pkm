// src/lib/client/router.ts
import { Effect } from "effect";
import { html, type TemplateResult } from "lit-html";
import { LocationService } from "./LocationService";
import { clientLog, RpcLogClient } from "./clientLog"; // Import RpcLogClient

// --- Placeholder Page Components ---
const LoginPage = (): ViewResult => ({ template: html`<div>Login Page</div>` });
const NotesView = (): ViewResult => ({ template: html`<div>Notes Page</div>` });
const UnauthorizedView = (): ViewResult => ({
  template: html`<div>403 Unauthorized</div>`,
});
const NotFoundView = (): ViewResult => ({
  template: html`<div>404 Not Found</div>`,
});

// --- Types ---
export interface ViewResult {
  template: TemplateResult;
  cleanup?: () => void;
}
export interface Route {
  pattern: RegExp;
  view: (...args: string[]) => ViewResult | HTMLElement;
  meta: {
    requiresAuth?: boolean;
    isPublicOnly?: boolean;
  };
}
type MatchedRoute = Route & { params: string[] };

// --- Route Definitions ---
const routes: Route[] = [
  { pattern: /^\/$/, view: NotesView, meta: { requiresAuth: true } },
  { pattern: /^\/login$/, view: LoginPage, meta: { isPublicOnly: true } },
  { pattern: /^\/unauthorized$/, view: UnauthorizedView, meta: {} },
];

// --- Router Logic ---
export const matchRoute = (path: string): Effect.Effect<MatchedRoute> =>
  Effect.gen(function* () {
    for (const route of routes) {
      const match = path.match(route.pattern);
      if (match) {
        return { ...route, params: match.slice(1) };
      }
    }
    return { pattern: /^\/404$/, view: NotFoundView, meta: {}, params: [] };
  });

// ✅ FIX: The signature is now honest about its requirements and potential error.
export const navigate = (
  path: string,
): Effect.Effect<void, Error, LocationService | RpcLogClient> =>
  Effect.gen(function* () {
    // This call is what adds the RpcLogClient requirement and the Error channel.
    yield* clientLog("info", `Navigating to ${path}`, undefined, "router");
    const location = yield* LocationService;
    yield* location.navigate(path);
  });
