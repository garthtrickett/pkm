import { Effect } from "effect";
import { html, type TemplateResult } from "lit-html";
import { LocationService } from "./LocationService";
import { clientLog, RpcLogClient } from "./clientLog";

// ✅ 1. Import your new component
import "../../components/pages/login-page";

// --- Placeholder Page Components ---
// We no longer need the LoginPage placeholder function.
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
  // ✅ 2. Replace the placeholder with a function that creates your new element
  {
    pattern: /^\/login$/,
    view: () => document.createElement("login-page"),
    meta: { isPublicOnly: true },
  },
  { pattern: /^\/unauthorized$/, view: UnauthorizedView, meta: {} },
];

// --- Router Logic (No changes needed below) ---
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

export const navigate = (
  path: string,
): Effect.Effect<void, Error, LocationService | RpcLogClient> =>
  Effect.gen(function* () {
    yield* clientLog("info", `Navigating to ${path}`, undefined, "router");
    const location = yield* LocationService;
    yield* location.navigate(path);
  });
