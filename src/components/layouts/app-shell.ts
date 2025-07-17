// src/components/layouts/app-shell.ts
import { render, html } from "lit-html";
import { Stream, Effect, Fiber } from "effect";
import { appStateStream } from "../../lib/client/lifecycle";
import { matchRoute, navigate } from "../../lib/client/router";
import { AppLayout } from "./AppLayout";
import { clientLog } from "../../lib/client/clientLog";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { type AuthModel } from "../../lib/client/stores/authStore";

const processStateChange = (
  appRoot: HTMLElement,
  { path, auth }: { path: string; auth: AuthModel },
) =>
  Effect.gen(function* () {
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
      return yield* Effect.sync(() => render(loader, appRoot));
    }

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
        `[app-shell] Route is public-only, but user is authenticated.
Navigating to /.`,
      );
      return yield* navigate("/");
    }

    yield* clientLog("debug", "[app-shell] Rendering matched route view:", {
      pattern: route.pattern.toString(),
    });

    // ✅ FIX: All routes now return a ViewResult, so we can simplify this.
    const { template: pageTemplate } = route.view(...route.params);

    // ✅ DEBUG LOG: See what we are about to render.
    yield* clientLog("error", "[app-shell] ABOUT TO RENDER. View result is:", {
      isElement: pageTemplate instanceof HTMLElement,
      tagName:
        pageTemplate instanceof HTMLElement
          ? pageTemplate.tagName
          : "TemplateResult",
    });

    yield* Effect.sync(() =>
      render(
        route.meta.isPublicOnly
          ? pageTemplate
          : AppLayout({ auth, children: pageTemplate }),
        appRoot,
      ),
    );

    yield* clientLog(
      "info",
      `Successfully rendered view for ${path}`,
      auth.user?.id,
      "AppShell:render",
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
