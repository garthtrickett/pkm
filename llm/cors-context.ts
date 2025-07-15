import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import * as HttpMiddleware from "@effect/platform/HttpMiddleware";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";



  

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";






// Here we are defining a CORS middleware
const CorsMiddleware = HttpLayerRouter.middleware(HttpMiddleware.cors()).layer;
// You can also use HttpLayerRouter.cors() to create a CORS middleware

class CurrentSession extends Context.Tag("CurrentSession")<
  CurrentSession,
  {
    readonly token: string;
  }
>() {}

// You can create middleware that provides a service to the HTTP requests.
const SessionMiddleware = HttpLayerRouter.middleware<{
  provides: CurrentSession;
}>()(
  Effect.gen(function* () {
    yield* Effect.log("SessionMiddleware initialized");

    return (httpEffect) =>
      Effect.provideService(httpEffect, CurrentSession, {
        token: "dummy-token",
      });
  }),
).layer;

Effect.gen(function* () {
  const router = yield* HttpLayerRouter.HttpRouter;
  yield* router.add(
    "GET",
    "/hello",
    Effect.gen(function* () {
      // Requests can now access the current session
      const session = yield* CurrentSession;
      return HttpServerResponse.text(
        `Hello, World! Your token is ${session.token}`,
      );
    }),
  );
}).pipe(
  Layer.effectDiscard,
  // Provide the SessionMiddleware & CorsMiddleware to some routes
  Layer.provide([SessionMiddleware, CorsMiddleware]),
);




