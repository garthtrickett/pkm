// src/db/migrations/central-migrations-manifest.ts
import type { Migration } from "kysely";

import * as m01 from "../../migrations/01_create_user";
import * as m02 from "../../migrations/02_create_note_and_tags";
import * as m03 from "../../migrations/03_create_auth_tables";
import * as m04 from "../../migrations/04_create_block";
import * as m05 from "../../migrations/05_create_replicache_tables";
import * as m06 from "../../migrations/06_create_poke_log";

export const centralMigrationObjects: Record<string, Migration> = {
  "01_create_user": { up: m01.up, down: m01.down },
  "02_create_note_and_tags": { up: m02.up, down: m02.down },
  "03_create_auth_tables": { up: m03.up, down: m03.down },
  "04_create_block": { up: m04.up, down: m04.down },
  "05_create_replicache_tables": { up: m05.up, down: m05.down },
  "06_create_poke_log": { up: m06.up, down: m06.down },
};
