// src/lib/client/lifecycle.ts
import { Chunk, Stream, Effect } from "effect";
import { authState, type AuthModel } from "./stores/authStore";
import { clientLog, RpcLogClient } from "./clientLog";
import { LocationService } from "./LocationService";

export const authStream: Stream.Stream<AuthModel, Error, RpcLogClient> =
  Stream.async<AuthModel>((emit) => {
    // Initial emit
    void emit(Effect.succeed(Chunk.of(authState.value)));
    // Subscribe to future changes
    const unsubscribe = authState.subscribe((value) => {
      void emit(Effect.succeed(Chunk.of(value)));
    });
    // Return the cleanup function
    return Effect.sync(() => {
      unsubscribe();
    });
  }).pipe(
    Stream.tap((value) =>
      clientLog(
        "debug",
        `[lifecycle] RAW authStream EMIT`,
        {
          status: value.status,
          userId: value.user?.id,
          source: "authStream:PRE_CHANGES",
        },
      ),
    ),
    // ✅ FIX: Use changesWith for explicit comparison.
    // This will only emit a new value if the status or the user's logged-in state changes.
    Stream.changesWith(
      (a, b) => a.status === b.status && a.user?.id === b.user?.id,
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
      "info",
      `[lifecycle] New app state emitted (POST-CHANGES)`,
      {
        path: state.path,
        authStatus: state.auth.status,
        userId: state.auth.user?.id,
        source: "AppStateStream",
      },
    ),
  ),
);
