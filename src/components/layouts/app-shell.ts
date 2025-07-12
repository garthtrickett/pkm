// src/components/layouts/app-shell.ts
import { render, html } from "lit-html";
import { Stream, Effect, Fiber } from "effect";
import { appStateStream, ViewManager } from "../../lib/client/lifecycle";
import { matchRoute, navigate } from "../../lib/client/router";
import { AppLayout } from "./AppLayout";
import { clientLog } from "../../lib/client/clientLog";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime"; // Import runClientUnscoped
import { type AuthModel } from "../../lib/client/stores/authStore";

// This effect now correctly declares all the services it needs in its R type
const processStateChange = (
  appRoot: HTMLElement,
  { path, auth }: { path: string; auth: AuthModel },
) =>
  Effect.gen(function* () {
    const viewManager = yield* ViewManager;

    if (auth.status === "initializing" || auth.status === "authenticating") {
      const loader = html`<div
        class="flex min-h-screen items-center justify-center"
      >
        <p>Loading...</p>
      </div>`;
      yield* Effect.sync(() => render(loader, appRoot));
      return yield* Effect.never;
    }

    const route = yield* matchRoute(path);

    if (route.meta.requiresAuth && auth.status === "unauthenticated") {
      // navigate now requires RpcLogClient, which will be provided by the runtime
      return yield* navigate("/login");
    }

    if (auth.status === "authenticated" && route.meta.isPublicOnly) {
      return yield* navigate("/");
    }

    yield* viewManager.cleanup();
    const viewResult = route.view(...route.params);
    const pageTemplate =
      viewResult instanceof HTMLElement
        ? html`${viewResult}`
        : viewResult.template;
    const pageCleanup =
      viewResult instanceof HTMLElement ? undefined : viewResult.cleanup;
    yield* viewManager.set(pageCleanup);
    yield* Effect.sync(() => render(AppLayout({ children: pageTemplate }), appRoot));
  });

export class AppShell extends HTMLElement {
  private mainFiber?: Fiber.RuntimeFiber<void, unknown>;

  connectedCallback() {
    // We no longer need to build a layer here.
    // The main stream simply declares its dependencies.
    const mainAppStream = appStateStream.pipe(
      Stream.flatMap(
        (state) => Stream.fromEffect(processStateChange(this, state)),
        { switch: true },
      ),
    );

    // ✅ FIX: We use runClientUnscoped which automatically provides ALL client
    // dependencies defined in `runtime.ts` to the stream.
    // This includes LocationService, RpcLogClient, and ViewManager.
    this.mainFiber = runClientUnscoped(Stream.runDrain(mainAppStream));

    // Log after starting the fiber.
    runClientUnscoped(
      clientLog("info", "<app-shell> connected. Main app stream started."),
    );
  }

  disconnectedCallback() {
    // Log before interrupting.
    runClientUnscoped(
      clientLog("warn", "<app-shell> disconnected. Interrupting main fiber."),
    );
    if (this.mainFiber) {
      // runClientPromise is fine here, as it also uses the global runtime.
      void runClientPromise(Fiber.interrupt(this.mainFiber));
    }
  }
}

customElements.define("app-shell", AppShell);
