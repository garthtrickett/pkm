// src/db/DbLayer.ts
import { Layer } from "effect";
import { Db } from "./DbTag";
import { makeDbLive } from "./kysely";

// The live layer for the Db service
export const DbLayer = Layer.effect(Db, makeDbLive);
