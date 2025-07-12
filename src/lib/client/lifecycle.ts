// src/lib/client/lifecycle.ts
import { Chunk, Context, Effect, Layer, Stream } from "effect";
import { clientLog, RpcLogClient } from "./clientLog";
import { LocationService } from "./LocationService";
import { type AuthModel, authState } from "./stores/authStore";
import { runClientUnscoped } from "./runtime"; // Import the runtime utility

export const authStream: Stream.Stream<AuthModel, Error, RpcLogClient> = Stream.async<AuthModel>(
  (emit) => {
    runClientUnscoped(clientLog("debug", "authStream subscribed."));
    // ✅ FIX: Use 'void' to explicitly ignore the promise returned by emit.
    void emit(Effect.succeed(Chunk.of(authState.value)));
    
    const unsubscribe = authState.subscribe((value) => {
      // ✅ FIX: Use 'void' here as well.
      void emit(Effect.succeed(Chunk.of(value)));
    });

    return Effect.sync(() => {
      runClientUnscoped(clientLog("debug", "authStream unsubscribed."));
      unsubscribe();
    });
  },
).pipe(
  Stream.tap((value) =>
    clientLog("debug", `authStream emitting status: ${value.status}`, value.user?.id, "lifecycle")
  ),
  Stream.changesWith(
    (a: AuthModel, b: AuthModel) =>
      a.status === b.status && a.user?.id === b.user?.id,
  ),
);

export const appStateStream: Stream.Stream<
  { path: string; auth: AuthModel },
  Error,
  LocationService | RpcLogClient
> = Stream.unwrap(
  Effect.gen(function* () {
    const location = yield* LocationService;
    return Stream.zipLatest(location.pathname, authStream);
  }),
).pipe(
  Stream.map(([path, auth]) => ({ path, auth })),
  Stream.tap((state) =>
    clientLog(
      "debug",
      `New app state: { path: "${state.path}", auth: "${state.auth.status}" }`,
      state.auth.user?.id,
      "AppStateStream",
    ),
  ),
);

export class ViewManager extends Context.Tag("ViewManager")<
  ViewManager,
  {
    readonly set: (cleanup: (() => void) | undefined) => Effect.Effect<void>;
    readonly cleanup: () => Effect.Effect<void>;
  }
>() {}

export const ViewManagerLive = Layer.sync(ViewManager, () => {
  let currentCleanup: (() => void) | undefined = undefined;
  return ViewManager.of({
    set: (cleanup) => Effect.sync(() => (currentCleanup = cleanup)),
    cleanup: () =>
      Effect.sync(() => {
        if (currentCleanup) {
          currentCleanup();
          currentCleanup = undefined;
        }
      }),
  });
});


