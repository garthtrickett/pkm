// FILE: ./src/lib/client/replicache/websocket.ts
import type { Replicache } from "replicache";
import { Effect, Schedule, Ref } from "effect";
import { clientLog } from "../clientLog"; // Import RpcLogClient
import type { ReplicacheMutators } from "../replicache";
import { runClientUnscoped } from "../../client/runtime";
import { RpcLogClient } from "../rpc";

const retryPolicy = Schedule.exponential(1000 /* 1 second base */).pipe(
  Schedule.jittered,
);

export const setupWebSocket = (
  rep: Replicache<ReplicacheMutators>,
  // ✅ FIX: The function's return type now correctly states its requirement for RpcLogClient.
): Effect.Effect<never, Error, RpcLogClient> =>
  Effect.gen(function* () {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return yield* Effect.fail(
        new Error("No JWT found for WebSocket connection."),
      );
    }
    const wsUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${
      window.location.host
    }/ws?token=${token}`;

    const wsRef = yield* Ref.make<WebSocket | null>(null);

    const connectOnce = Effect.async<never, Error>((resume) => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        runClientUnscoped(clientLog("info", "WebSocket connection opened."));
        void Ref.set(wsRef, ws);
        ws.onmessage = async (event) => {
          if (event.data === "poke") {
            runClientUnscoped(
              clientLog("info", "Poke received, initiating replicache.pull()"),
            );
            await rep.pull();
          }
        };
      };

      ws.onerror = (event) => {
        runClientUnscoped(
          clientLog("error", "WebSocket error", { error: event }),
        );
        resume(Effect.fail(new Error("WebSocket error")));
      };

      ws.onclose = (event) => {
        runClientUnscoped(
          clientLog("warn", "WebSocket connection closed.", {
            code: event.code,
            reason: event.reason,
          }),
        );
        resume(Effect.fail(new Error("WebSocket closed")));
      };
    });

    const connectionLoop = Effect.retry(connectOnce, retryPolicy);

    const finalizer = Effect.gen(function* () {
      yield* clientLog("info", "Closing WebSocket due to scope release.");
      const ws = yield* Ref.get(wsRef);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    });

    return yield* Effect.ensuring(connectionLoop, finalizer);
  });
