// FILE: ./src/lib/client/rpc.ts
import { RpcClient, RpcSerialization, type RpcGroup } from "@effect/rpc";
import { Layer, Context } from "effect";
import { AuthRpc } from "../shared/api";
import { RpcLog } from "../shared/log-schema";

// This layer defines the protocol and serialization for our RPCs.
// It has an unsatisfied dependency: HttpClient.HttpClient
export const RpcProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerJson));

// --- Auth RPC Client ---

// 1. Define the service interface using a simple Tag
export class RpcAuthClient extends Context.Tag("RpcAuthClient")<
  RpcAuthClient,
  // ✅ FIX: Use the fully qualified type `RpcClient.RpcClient`
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof AuthRpc>>
>() {}

// 2. Define the live layer, which creates the client.
// This is an effectful layer that depends on the `RpcClient.Protocol`
// to be provided elsewhere.
export const RpcAuthClientLive = Layer.effect(
  RpcAuthClient,
  RpcClient.make(AuthRpc),
);

// --- Log RPC Client ---

// 1. Define the service interface using the same pattern.
export class RpcLogClient extends Context.Tag("RpcLogClient")<
  RpcLogClient,
  // ✅ FIX: Use the fully qualified type `RpcClient.RpcClient`
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof RpcLog>>
>() {}

// 2. Define the live layer for the log client.
export const RpcLogClientLive = Layer.effect(
  RpcLogClient,
  RpcClient.make(RpcLog),
);
