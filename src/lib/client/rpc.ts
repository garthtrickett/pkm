// FILE: ./src/lib/client/rpc.ts
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";

import { AuthRpc } from "../shared/api";
import { RpcLog } from "../shared/log-schema";

// --- Auth RPC Client ---
const AuthProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerJson));

export class RpcAuthClient extends Effect.Service<RpcAuthClient>()(
  "RpcAuthClient",
  {
    dependencies: [AuthProtocolLive],
    scoped: RpcClient.make(AuthRpc),
  },
) {}

export const RpcAuthClientLive = RpcAuthClient.Default;

// --- Log RPC Client ---
const LogProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerJson));

export class RpcLogClient extends Effect.Service<RpcLogClient>()(
  "RpcLogClient",
  {
    dependencies: [LogProtocolLive],
    scoped: RpcClient.make(RpcLog),
  },
) {}

export const RpcLogClientLive = RpcLogClient.Default;
