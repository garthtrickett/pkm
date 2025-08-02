// FILE: ./src/lib/client/lifecycle.ts
import { Chunk, Stream, Effect } from "effect";
import { authState, type AuthModel } from "./stores/authStore";
import { clientLog } from "./clientLog";
import { RpcLogClient } from "./rpc";
import { LocationService } from "./LocationService";
import {
  activateReplicacheRuntime,
  deactivateReplicacheRuntime,
} from "./runtime";

// Raw stream of auth state changes from the signal
export const authStream: Stream.Stream<AuthModel, Error, RpcLogClient> =
  Stream.async<AuthModel>((emit) => {
    // ✅ FIX: Added `void` to handle the floating promise
    void emit(Effect.succeed(Chunk.of(authState.value)));
    const unsubscribe = authState.subscribe((value) => {
      // ✅ FIX: Added `void` to handle the floating promise
      void emit(Effect.succeed(Chunk.of(value)));
    });
    return Effect.sync(() => unsubscribe());
  }).pipe(
    Stream.tap((value) =>
      clientLog("debug", `[lifecycle] RAW authStream EMIT`, {
        status: value.status,
        userId: value.user?.id,
      }),
    ),
    Stream.changesWith(
      (a, b) => a.status === b.status && a.user?.id === b.user?.id,
    ),
  );

/**
 * A new stream that coordinates state changes with runtime lifecycle.
 * It listens to the raw authStream and performs the necessary runtime
 * activation/deactivation BEFORE emitting the state. This eliminates race conditions.
 */
const coordinatedAuthStream = authStream.pipe(
  Stream.mapEffect(
    (auth) =>
      Effect.gen(function* () {
        if (auth.status === "authenticated") {
          yield* clientLog(
            "info",
            "[coordinator] Auth state is AUTHENTICATED. Activating runtime...",
          );
          // Wait for the runtime activation to complete
          yield* activateReplicacheRuntime(auth.user!);
          yield* clientLog(
            "info",
            "[coordinator] Runtime is ACTIVE. Emitting ready state.",
          );
        } else if (auth.status === "unauthenticated") {
          yield* clientLog(
            "info",
            "[coordinator] Auth state is UNAUTHENTICATED. Deactivating runtime...",
          );
          // Wait for the runtime deactivation to complete
          yield* deactivateReplicacheRuntime();
          yield* clientLog(
            "info",
            "[coordinator] Runtime is INACTIVE. Emitting ready state.",
          );
        }
        // For other states like 'initializing', just pass them through immediately.
        return auth;
      }),
    { concurrency: 1 }, // Ensure states are processed one at a time.
  ),
);

// The main application state stream, combining auth and location
export const appStateStream: Stream.Stream<
  { path: string; auth: AuthModel },
  Error,
  LocationService | RpcLogClient
> = Stream.unwrap(
  Effect.gen(function* () {
    const location = yield* LocationService;
    // Use the NEW coordinated stream instead of the raw authStream
    return Stream.zipLatest(location.pathname, coordinatedAuthStream);
  }),
).pipe(
  Stream.map(([path, auth]) => ({ path, auth })),
  Stream.tap((state) =>
    clientLog("info", `[lifecycle] New COORDINATED app state emitted`, {
      path: state.path,
      authStatus: state.auth.status,
      userId: state.auth.user?.id,
    }),
  ),
);
