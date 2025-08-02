// src/lib/server/auth.ts
import {
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Layer, Metric, Option } from "effect";
import { Db } from "../../db/DbTag";
import type { Session } from "../../types/generated/public/Session";
import { Auth, AuthError, AuthMiddleware } from "../shared/auth";
import type { PublicUser } from "../shared/schemas";
import { sessionValidationSuccessCounter } from "./metrics";
import { JwtService } from "./JwtService";

// Re-export for convenience in other server files
export { Auth, AuthMiddleware, AuthError };

/**
 * Extracts a Bearer token from the Authorization header.
 */
const getBearerTokenFromRequest = (
  req: HttpServerRequest.HttpServerRequest,
): Option.Option<string> =>
  Option.fromNullable(req.headers["authorization"]).pipe(
    Option.filter((header) => header.startsWith("Bearer ")),
    Option.map((header) => header.substring(7)),
  );

// --- LIVE IMPLEMENTATION ---
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const jwtService = yield* JwtService;
    const db = yield* Db;

    return ({ clientId, rpc }) => {
      const logic = Effect.gen(function* () {
        const rpcTag = rpc._tag;
        yield* Effect.logInfo(
          { clientId, rpc: rpcTag },
          "AuthMiddleware triggered",
        ); //

        const request = yield* HttpServerRequest.HttpServerRequest;
        const tokenOption = getBearerTokenFromRequest(request);

        if (Option.isNone(tokenOption)) {
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "No authorization token provided",
            }),
          );
        }

        const user = yield* jwtService.validateToken(tokenOption.value).pipe(
          // Provide the Db service to the validation effect
          Effect.provideService(Db, db),
        );

        yield* Metric.increment(sessionValidationSuccessCounter);

        return { user, session: null };
      });

      // This cast is safe because the RpcServer's HTTP adapter runs this middleware
      // within a context that already provides HttpServerRequest.
      return logic as Effect.Effect<
        { user: PublicUser; session: Session | null },
        AuthError,
        never
      >;
    };
  }),
);

// --- HTTP-SPECIFIC MIDDLEWARE ---
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const jwtService = yield* JwtService;
    const db = yield* Db;

    const tokenOption = getBearerTokenFromRequest(request);

    if (Option.isNone(tokenOption)) {
      yield* Effect.logWarning(
        "[httpAuthMiddleware] FAILURE: No session cookie provided.",
      );
      return yield* Effect.fail(
        HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const user = yield* jwtService.validateToken(tokenOption.value).pipe(
      Effect.provideService(Db, db),
      Effect.catchAll((authError) =>
        Effect.logWarning(
          "[httpAuthMiddleware] FAILURE: Invalid or expired token.",
          authError,
        ).pipe(
          Effect.andThen(
            Effect.fail(
              HttpServerResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
              ),
            ),
          ),
        ),
      ),
    );

    yield* Metric.increment(sessionValidationSuccessCounter);
    const authService = Auth.of({
      user: user,
      session: null,
    });
    return yield* Effect.provideService(app, Auth, authService);
  }),
);
