// bun-server.ts
import { HttpRouter, HttpMiddleware } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer } from "effect";
import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import { Auth } from "./src/lib/server/auth";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import { httpAuthMiddleware } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";

// RPCs, handlers, etc.
// ✅ FIX: Import the separated RPC definitions and handlers
import { UnprotectedAuthRpc, ProtectedAuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import {
  UnprotectedAuthRpcHandlers,
  ProtectedAuthRpcHandlers,
} from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http";

// --- Handler Layers ---
// ✅ FIX: Create separate layers for each handler group based on their requirements.
const UnprotectedHandlersLive = UnprotectedAuthRpc.toLayer(
  UnprotectedAuthRpcHandlers,
);
const ProtectedHandlersLive = Layer.mergeAll(
  ProtectedAuthRpc.toLayer(ProtectedAuthRpcHandlers),
  UserRpcs.toLayer(RpcUserHandlers),
);
const LogHandlersLive = RpcLog.toLayer(RpcLogHandlers);

// --- CORS Middleware Layer ---
const CorsLayer = HttpLayerRouter.middleware(
  HttpMiddleware.cors({
    allowedOrigins: ["https://localhost:5173"],
    allowedMethods: ["*"],
    allowedHeaders: ["*"],
    credentials: true,
  }),
).layer;

// --- Main Application Layer ---
const ApplicationLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const router = yield* HttpRouter.Default;

    // --- Unprotected RPC App ---
    const unprotectedRpcApp = yield* RpcServer.toHttpApp(
      UnprotectedAuthRpc,
    ).pipe(
      Effect.provide(UnprotectedHandlersLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );

    // ✅ FIX: This app is now "clean" and can be mounted directly.
    const finalUnprotectedApp = unprotectedRpcApp.pipe(
      Effect.provide(DbLayer),
      Effect.provide(CryptoLive),
    );
    yield* router.mountApp("/api/rpc", Effect.scoped(finalUnprotectedApp));

    // --- Protected RPC App ---
    const protectedRpcApp = yield* RpcServer.toHttpApp(
      ProtectedAuthRpc.merge(UserRpcs),
    ).pipe(
      Effect.provide(ProtectedHandlersLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );

    const authedProtectedApp = protectedRpcApp.pipe(httpAuthMiddleware);

    // ✅ FIX: This app is now "clean" and can be mounted directly.
    const finalProtectedApp = authedProtectedApp.pipe(
      Effect.provide(DbLayer),
      Effect.provide(CryptoLive),
    );
    yield* router.mountApp("/api/rpc", Effect.scoped(finalProtectedApp));

    // --- Log RPC App ---
    const logRpcApp = yield* RpcServer.toHttpApp(RpcLog).pipe(
      Effect.provide(LogHandlersLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );
    yield* router.mountApp("/api/rpc", Effect.scoped(logRpcApp));

    // --- HTTP Route Mounting ---
    const protectedUserRoutes = HttpRouter.empty.pipe(
      HttpRouter.mountApp("/api/user", UserHttpRoutes),
      HttpRouter.use(httpAuthMiddleware),
    );
    const finalUserRoutes = protectedUserRoutes.pipe(
      Effect.provide(DbLayer),
      Effect.provide(CryptoLive),
      Effect.provide(S3UploaderLive),
      Effect.provide(ConfigLive),
    );
    yield* router.mountApp("/", Effect.scoped(finalUserRoutes));
  }),
).pipe(Layer.provide(CorsLayer));

const AuthStubLive = Layer.succeed(
  Auth,
  Auth.of({ user: null, session: null }),
);

// --- Top-Level Composition (Provides all singleton dependencies) ---
const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(ApplicationLive),
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(ObservabilityLive),
  Layer.provide(DbLayer),
  Layer.provide(CryptoLive),
  Layer.provide(S3UploaderLive),
  Layer.provide(ConfigLive),
  Layer.provide(AuthStubLive),
);

// This program is now "clean" and has a context of `never`.
const program = Layer.launch(AppMain);
const runnable = Effect.provide(program, Layer.scope);

// This will now type-check correctly.
BunRuntime.runMain(runnable);
