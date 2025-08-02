// FILE: src/lib/client/rpc.ts
import { RpcClient, type RpcGroup } from "@effect/rpc";
import { Layer, Context } from "effect";
import { AuthRpc } from "../shared/api";
import { RpcLog } from "../shared/log-schema";

// --- Auth RPC Client ---
export class RpcAuthClient extends Context.Tag("RpcAuthClient")<
  RpcAuthClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof AuthRpc>>
>() {}

// This layer now simply states: "To provide an RpcAuthClient, I need an RpcClient.Protocol"
export const RpcAuthClientLive = Layer.effect(
  RpcAuthClient,
  RpcClient.make(AuthRpc),
);

// --- Log RPC Client ---
export class RpcLogClient extends Context.Tag("RpcLogClient")<
  RpcLogClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof RpcLog>>
>() {}

// This layer now simply states: "To provide an RpcLogClient, I need an RpcClient.Protocol"
export const RpcLogClientLive = Layer.effect(
  RpcLogClient,
  RpcClient.make(RpcLog),
);
