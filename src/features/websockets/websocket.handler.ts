// FILE: src/features/websockets/websocket.handler.ts
import { HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { Cause, Effect, Option, Stream } from "effect";
// ✅ IMPORT: Import session logic from the new, dedicated service file.
import { validateSessionEffect } from "../../lib/server/session.service";
import { PokeService } from "../../lib/server/PokeService";

export const wsHandler = Stream.fromEffect(
  Effect.gen(function* () {
    const pokeService = yield* PokeService;
    const req = yield* HttpServerRequest.HttpServerRequest;
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId) {
      return yield* Effect.fail(
        HttpServerResponse.text("No session ID", { status: 401 }),
      );
    }
    const { user } = yield* validateSessionEffect(sessionId);
    if (!user) {
      return yield* Effect.fail(
        HttpServerResponse.text("Invalid session", { status: 401 }),
      );
    }
    yield* Effect.logInfo(
      `WebSocket connection established for user: ${user.id}`,
    );
    return { pokeService, user };
  }),
).pipe(
  Stream.flatMap(({ pokeService, user }) => pokeService.subscribe(user.id)),
  Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
  Stream.runDrain,
  Effect.as(HttpServerResponse.empty()),
  Effect.catchAllCause((cause) => {
    const failure = Cause.failureOption(cause);
    if (
      Option.isSome(failure) &&
      HttpServerResponse.isServerResponse(failure.value)
    ) {
      return Effect.succeed(failure.value);
    }
    return Effect.logError(
      "Unhandled WebSocket handler error.",
      Cause.pretty(cause),
    ).pipe(Effect.andThen(HttpServerResponse.empty({ status: 500 })));
  }),
);
