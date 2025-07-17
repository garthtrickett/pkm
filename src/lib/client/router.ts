// src/lib/client/router.ts
import { Effect } from "effect";
import { html, type TemplateResult } from "lit-html";
import { clientLog, RpcLogClient } from "./clientLog";
import { LocationService } from "./LocationService";

// --- Import page components ---
import "../../components/pages/notes-page";
import type { NotePage } from "../../components/pages/note-page";
import "../../components/pages/login-page";
import "../../components/pages/signup-page";
import "../../components/pages/check-email-page";
import "../../components/pages/verify-email-page";
import type { VerifyEmailPage } from "../../components/pages/verify-email-page";
import "../../components/pages/profile-page";
import "../../components/pages/forgot-password-page";
import "../../components/pages/reset-password-page";
import type { ResetPasswordPage } from "../../components/pages/reset-password-page";

const UnauthorizedView = (): ViewResult => ({
  template: html`<div>403 Unauthorized</div>`,
});
const NotFoundView = (): ViewResult => ({
  template: html`<div>404 Not Found</div>`,
});

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

const routes: Route[] = [
  {
    pattern: /^\/$/,
    view: () => document.createElement("notes-page"),
    meta: { requiresAuth: true },
  },
  {
    pattern: /^\/notes\/([^/]+)$/,
    view: (id: string) => {
      const el = document.createElement("note-page") as NotePage;
      el.id = id; // Pass the ID as a property
      return el;
    },
    meta: { requiresAuth: true },
  },
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
      const el = document.createElement("verify-email-page") as VerifyEmailPage;
      el.token = token;
      return el;
    },
    meta: { isPublicOnly: true },
  },
  {
    pattern: /^\/profile$/,
    view: () => document.createElement("profile-page"),
    meta: { requiresAuth: true },
  },
  // ✅ ADDED: New routes for password reset flow
  {
    pattern: /^\/forgot-password$/,
    view: () => document.createElement("forgot-password-page"),
    meta: { isPublicOnly: true },
  },
  {
    pattern: /^\/reset-password\/([^/]+)$/,
    view: (token: string) => {
      const el = document.createElement(
        "reset-password-page",
      ) as ResetPasswordPage;
      el.token = token;
      return el;
    },
    meta: { isPublicOnly: true },
  },
  { pattern: /^\/unauthorized$/, view: UnauthorizedView, meta: {} },
];

// ... (matchRoute and navigate functions are unchanged)
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
