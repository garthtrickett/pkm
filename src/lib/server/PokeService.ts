// src/lib/server/PokeService.ts
import { Context, Effect, Layer, PubSub, Ref } from "effect";
import type { UserId } from "../../types/generated/public/User";
import { Stream } from "effect";

export interface IPokeService {
  readonly poke: (userId: UserId) => Effect.Effect<void>;
  readonly subscribe: (userId: UserId) => Stream.Stream<string, never, never>;
}

export class PokeService extends Context.Tag("PokeService")<
  PokeService,
  IPokeService
>() {}

export const PokeServiceLive = Layer.scoped(
  PokeService,
  Effect.gen(function* () {
    const userPubSubs = yield* Ref.make(
      new Map<UserId, PubSub.PubSub<string>>(),
    );
    yield* Effect.logInfo("Singleton PokeService created.");

    const poke = (userId: UserId) =>
      Effect.gen(function* () {
        yield* Effect.logDebug({ userId }, "PokeService.poke() called.");
        const pubSubsMap = yield* Ref.get(userPubSubs);
        const userPubSub = pubSubsMap.get(userId);
        if (userPubSub) {
          yield* PubSub.publish(userPubSub, "poke");
        }
      });

    const subscribe = (userId: UserId) =>
      Stream.unwrap(
        Effect.gen(function* () {
          const pubSubsMap = yield* Ref.get(userPubSubs);
          let userPubSub = pubSubsMap.get(userId);
          if (!userPubSub) {
            yield* Effect.logDebug(
              { userId },
              "Creating new PubSub for user's first WebSocket connection.",
            );
            userPubSub = yield* PubSub.unbounded<string>();
            yield* Ref.update(userPubSubs, (map) =>
              map.set(userId, userPubSub!),
            );
          }
          return Stream.fromPubSub(userPubSub).pipe(
            // ✅ THIS IS THE FIX ✅
            // Use `onError` to log failures without altering the stream type.
            // This operator is specifically for side-effects on failure.
            Stream.onError((cause) =>
              Effect.logError("Error within user subscription stream", {
                userId,
                cause,
              }),
            ),
            Stream.ensuring(
              Effect.logInfo({ userId }, "WebSocket stream for user ended."),
            ),
          );
        }),
      );

    return PokeService.of({ poke, subscribe });
  }),
);
