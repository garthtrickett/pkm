import { Layer } from "effect";
import { makeDbLive } from "./kysely";
import { Db } from "./DbTag";

/**
 * A Layer that provides a standard Kysely instance to the application.
 * It uses the `makeDbLive` Effect from `kysely.ts` as its implementation.
 * This aligns with the request to use the standard Kysely API within the
 * Effect ecosystem.
 */
export const DbLayer = Layer.effect(Db, makeDbLive);
