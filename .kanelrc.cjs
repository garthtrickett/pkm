// .kanelrc.cjs
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const { makeKyselyHook } = require("kanel-kysely");

/** @type {import('kanel').Config} */
module.exports = {
  // Use the local proxy or the direct Neon URL based on the .env flag
  connection:
    process.env.USE_LOCAL_NEON_PROXY === "true"
      ? process.env.DATABASE_URL_LOCAL
      : process.env.DATABASE_URL,

  // Path where the generated types will be stored
  outputPath: "./src/types/generated",

  // Use the Kysely hook to generate types compatible with Kysely
  preRenderHooks: [makeKyselyHook()],
};
