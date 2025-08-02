// FILE: src/features/websockets/websocket.handler.ts
import { HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { Cause, Effect, Option, Stream } from "effect";
import { PokeService } from "../../lib/server/PokeService";
import { JwtService } from "../../lib/server/JwtService";
import { Db } from "../../db/DbTag";

export const wsHandler = Stream.fromEffect(
  Effect.gen(function* () {
    const pokeService = yield* PokeService;
    const jwtService = yield* JwtService;
    const db = yield* Db;
    const req = yield* HttpServerRequest.HttpServerRequest;
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const token = url.searchParams.get("token");
    if (!token) {
      return yield* Effect.fail(
        HttpServerResponse.text("No token provided", { status: 401 }),
      );
    }

    // Use the JwtService to validate the token.
    // The Db service is provided to the validation effect.
    const user = yield* jwtService
      .validateToken(token)
      .pipe(Effect.provideService(Db, db));

    if (!user) {
      return yield* Effect.fail(
        HttpServerResponse.text("Invalid token", { status: 401 }),
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
      "Unhandled WebSocket handler error.", //
      Cause.pretty(cause),
    ).pipe(Effect.andThen(HttpServerResponse.empty({ status: 500 })));
  }),
);
