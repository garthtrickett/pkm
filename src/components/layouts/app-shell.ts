// src/components/layouts/app-shell.ts
import { render, html } from "lit-html";
import { Stream, Effect, Fiber } from "effect";
import { appStateStream } from "../../lib/client/lifecycle";
import { matchRoute, navigate } from "../../lib/client/router";
import { AppLayout } from "./AppLayout";
import { clientLog } from "../../lib/client/clientLog";
import {
  runClientPromise,
  runClientUnscoped,
  ViewManager,
} from "../../lib/client/runtime";
import { type AuthModel } from "../../lib/client/stores/authStore";

const processStateChange = (
  appRoot: HTMLElement,
  { path, auth }: { path: string; auth: AuthModel },
) =>
  Effect.gen(function* () {
    const viewManager = yield* ViewManager;

    yield* clientLog("info", "[app-shell] processStateChange triggered", {
      path,
      authStatus: auth.status,
    });

    if (auth.status === "initializing" || auth.status === "authenticating") {
      yield* clientLog("debug", "[app-shell] Rendering loading state.");
      const loader = html`<div
        class="flex min-h-screen items-center justify-center"
      >
        <p>Loading...</p>
      </div>`;
      // FIX: This should not return Effect.never
      return yield* Effect.sync(() => render(loader, appRoot));
    }

    yield* clientLog("debug", "[app-shell] Matching route for path:", path);
    const route = yield* matchRoute(path);

    if (route.meta.requiresAuth && auth.status === "unauthenticated") {
      yield* clientLog(
        "warn",
        "[app-shell] Route requires auth, but user is unauthenticated. Navigating to /login.",
      );
      return yield* navigate("/login");
    }

    if (auth.status === "authenticated" && route.meta.isPublicOnly) {
      yield* clientLog(
        "warn",
        "[app-shell] Route is public-only, but user is authenticated. Navigating to /.",
      );
      return yield* navigate("/");
    }

    yield* clientLog("debug", "[app-shell] Rendering matched route view:", {
      pattern: route.pattern.toString(),
    });
    yield* viewManager.cleanup();
    const viewResult = route.view(...route.params);
    const pageTemplate =
      viewResult instanceof HTMLElement
        ? html`${viewResult}`
        : viewResult.template;
    const pageCleanup =
      viewResult instanceof HTMLElement ? undefined : viewResult.cleanup;
    yield* viewManager.set(pageCleanup);
    yield* Effect.sync(() =>
      // ✅ CONDITIONAL LAYOUT:
      // If the route is public-only (like login/signup), don't wrap it in the main AppLayout.
      // Otherwise, wrap it to include the header.
      render(
        route.meta.isPublicOnly
          ? pageTemplate
          : AppLayout({ children: pageTemplate }),
        appRoot,
      ),
    );
  });

export class AppShell extends HTMLElement {
  private mainFiber?: Fiber.RuntimeFiber<void, unknown>;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    const mainAppStream = appStateStream.pipe(
      Stream.flatMap(
        (state) => Stream.fromEffect(processStateChange(this, state)),
        { switch: true },
      ),
    );

    this.mainFiber = runClientUnscoped(Stream.runDrain(mainAppStream));

    runClientUnscoped(
      clientLog("info", "<app-shell> connected. Main app stream started."),
    );
  }

  disconnectedCallback() {
    runClientUnscoped(
      clientLog("warn", "<app-shell> disconnected. Interrupting main fiber."),
    );
    if (this.mainFiber) {
      void runClientPromise(Fiber.interrupt(this.mainFiber));
    }
  }
}

customElements.define("app-shell", AppShell);
