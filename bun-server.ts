// bun-server.ts
import { HttpServerResponse, HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import { AuthMiddlewareLive } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { AuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { RpcLogHandlers } from "./src/features/log/log.handler";

// --- 1. Define Combined RPCs and Handler Dependencies ---
const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog);

const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
};

const HandlerDependenciesLive = Layer.mergeAll(DbLayer, CryptoLive);

const RpcHandlersProviderLive = mergedRpc
  .toLayer(allRpcHandlers)
  .pipe(Layer.provide(HandlerDependenciesLive));

const AppAuthMiddlewareLive = AuthMiddlewareLive.pipe(Layer.provide(DbLayer));

// --- 2. Create the HttpApp from the RPC definition ---
const rpcAppEffect = RpcServer.toHttpApp(mergedRpc);

// --- 3. Create a Single "Application" Layer to Combine All Routes ---
const ApplicationLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const router = yield* HttpRouter.Default;
    yield* router.get(
      "/api/health",
      Effect.succeed(HttpServerResponse.text("OK")),
    );

    const rpcHttpApp = yield* rpcAppEffect.pipe(
      Effect.provide(RpcHandlersProviderLive),
      Effect.provide(AppAuthMiddlewareLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );

    const selfContainedRpcApp = Effect.scoped(rpcHttpApp);
    yield* router.mountApp("/api/rpc", selfContainedRpcApp);
  }),
);

// --- 4. Compose the Final Server Layer ---
const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(ApplicationLive),
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(ObservabilityLive),
);

// --- 5. Launch the application ---

// The main program is the effect of launching our application layer.
const program = Layer.launch(AppMain);

// Explicitly provide the final top-level scope to the program.
// This satisfies the `Scope` requirement, making the effect runnable.
const runnable = Effect.provide(program, Layer.scope);

// Now, pass the fully self-contained effect to the runtime.
BunRuntime.runMain(runnable);
