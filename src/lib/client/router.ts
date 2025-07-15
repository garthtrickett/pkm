import { Effect } from "effect";
import { html, type TemplateResult } from "lit-html";
import { LocationService } from "./LocationService";
import { clientLog, RpcLogClient } from "./clientLog";

// --- Import your page components ---
import "../../components/pages/login-page";
import "../../components/pages/signup-page";
import "../../components/pages/check-email-page";
// ✅ FIX 3: Import the VerifyEmailPage class definition
import "../../components/pages/verify-email-page";
import type { VerifyEmailPage } from "../../components/pages/verify-email-page";

// --- Placeholder Page Components ---
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
  {
    pattern: /^\/login$/,
    view: () => document.createElement("login-page"),
    meta: { isPublicOnly: true },
  },
  {
    pattern: /^\/signup$/,
    view: () => document.createElement("signup-page"),
    meta: { isPublicOnly: true },
  },
  {
    pattern: /^\/check-email$/,
    view: () => document.createElement("check-email-page"),
    meta: { isPublicOnly: true },
  },
  {
    pattern: /^\/verify-email\/([^/]+)$/,
    view: (token: string) => {
      // ✅ FIX 3: Cast the created element to its specific class
      const el = document.createElement("verify-email-page") as VerifyEmailPage;
      el.token = token;
      return el;
    },
    meta: { isPublicOnly: true },
  },
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

export const navigate = (
  path: string,
): Effect.Effect<void, Error, LocationService | RpcLogClient> =>
  Effect.gen(function* () {
    yield* clientLog("info", `Navigating to ${path}`, undefined, "router");
    const location = yield* LocationService;
    yield* location.navigate(path);
  });
