// src/features/replicache/replicache.handler.ts
import { ReplicacheRpc } from "../../lib/shared/api";
import { handlePull } from "./pull";
import { handlePush } from "./push";

export const ReplicacheHandlers = ReplicacheRpc.of({
  replicachePull: (req) => handlePull(req),
  replicachePush: (req) => handlePush(req),
});
