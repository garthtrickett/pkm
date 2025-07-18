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

// ✅ THIS IS THE FIX (ALTERNATIVE) ✅
// We create the service implementation inside a single Effect.
// This effect will only be run ONCE when the Layer is first initialized.
const makePokeService = Effect.gen(function* () {
  // This Ref and Map will be created only one time and shared.
  const userPubSubs = yield* Ref.make(new Map<UserId, PubSub.PubSub<string>>());
  yield* Effect.logInfo("Singleton PokeService created via Layer.effect.");

  // The 'poke' and 'subscribe' functions close over the single `userPubSubs` Ref.
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
          yield* Ref.update(userPubSubs, (map) => map.set(userId, userPubSub!));
        }
        return Stream.fromPubSub(userPubSub).pipe(
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

  // Return the service implementation object.
  return PokeService.of({ poke, subscribe });
});

// Create the layer from our single-execution Effect.
export const PokeServiceLive = Layer.effect(PokeService, makePokeService);
