import { Context, Schema } from "effect";
import { RpcMiddleware } from "@effect/rpc";
import { Effect, Layer } from "effect";

// The authenticated user model
export class User extends Schema.Class<User>("User")({
  id: Schema.String,
  name: Schema.String,
}) {}

// A service tag that will hold the authenticated user
export class Auth extends Context.Tag("Auth")<
  Auth,
  { readonly user: User }
>() {}

// A specific, typed error for authentication failures
export class UnauthorizedError extends Schema.Class<UnauthorizedError>(
  "UnauthorizedError",
)({
  message: Schema.String,
}) {}

// Define the middleware itself using RpcMiddleware.Tag
export class AuthMiddleware extends RpcMiddleware.Tag<AuthMiddleware>()(
  "AuthMiddleware",
  {
    wrap: true,
    provides: Auth,
    failure: UnauthorizedError,
  },
) {}

// Implementation of the AuthMiddleware
export const AuthMiddlewareLive = Layer.succeed(
  AuthMiddleware,
  ({ headers, next }) => {
    // 1. Define an effect to validate the token
    const validateToken = Effect.succeed(headers["authorization"]).pipe(
      Effect.filterOrFail(
        (header): header is string =>
          header !== undefined && header.startsWith("Bearer "),
        () => new UnauthorizedError({ message: "Missing or invalid token" }),
      ),
      Effect.map((header) => header.slice(7)),
      Effect.filterOrFail(
        (token) => token === "secret-token",
        () => new UnauthorizedError({ message: "Invalid token" }),
      ),
      // On success, create the user
      Effect.map(() => new User({ id: "123", name: "Sandro" })),
    );

    // 2. Use flatMap to chain the validation with the next step
    return Effect.flatMap(validateToken, (user) =>
      // If validation succeeds, provide the Auth service to the `next` handler
      Effect.provideService(next, Auth, { user }),
    );
  },
);
