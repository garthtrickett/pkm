// src/lib/client/replicache/websocket.ts
import type { Replicache } from "replicache";
import { Effect } from "effect";
import { clientLog } from "../clientLog";
import type { ReplicacheMutators } from "../replicache";
import { runClientUnscoped } from "../../client/runtime"; // 👈 Import the correct runner

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const setupWebSocket = (
  rep: Replicache<ReplicacheMutators>,
): Effect.Effect<WebSocket, Error, never> =>
  Effect.gen(function* () {
    const sessionId = getCookie("session_id");
    if (!sessionId) {
      return yield* Effect.fail(
        new Error("No session_id cookie found for WebSocket connection."),
      );
    }

    const wsUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws?sessionId=${sessionId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // ✅ FIX: Use runClientUnscoped to execute the logging effect
      runClientUnscoped(clientLog("info", "WebSocket connection opened."));
    };

    ws.onmessage = async (event) => {
      if (event.data === "poke") {
        // ✅ FIX: Use runClientUnscoped
        runClientUnscoped(
          clientLog(
            "info",
            "Poke received from server, initiating replicache.pull()",
          ),
        );
        await rep.pull();
      }
    };

    ws.onerror = (event) => {
      // ✅ FIX: Use runClientUnscoped
      runClientUnscoped(
        clientLog("error", "WebSocket error", { error: event }),
      );
    };

    ws.onclose = (event) => {
      // ✅ FIX: Use runClientUnscoped
      runClientUnscoped(
        clientLog("warn", "WebSocket connection closed.", {
          code: event.code,
          reason: event.reason,
        }),
      );
    };

    return ws;
  });
