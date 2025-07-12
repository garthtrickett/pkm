// FILE: lib/server/migrations/central-migrations-manifest.ts
import type { Migration } from "kysely";

// Existing migrations
import * as m2025062601 from "../../migrations/2025062601_create_user";
import * as m2025062602 from "../../migrations/2025062602_create_note";
import * as m2025062603 from "../../migrations/2025062603_create_tag";
import * as m2025062604 from "../../migrations/2025062604_create_note_tag";
import * as m2025062701 from "../../migrations/2025062701_create_session";
import * as m2025062702 from "../../migrations/2025062702_add_permissions_to_user";
import * as m2025062801 from "../../migrations/2025062801_add_avatar_to_user";
import * as m2025063001 from "../../migrations/2025063001_create_password_reset_token";
import * as m2025063002 from "../../migrations/2025063002_create_email_verification_token";
import * as m2025063003 from "../../migrations/2025063003_add_email_verified_to_user";
import * as m2025070201 from "../../migrations/2025070201_create_block";
import * as m2025070203 from "../../migrations/2025070203_add_replicache_tables";
import * as m2025070301 from "../../migrations/2025070301_add_note_id_to_block";
import * as m2025070401 from "../../migrations/2025070401_create_change_log";
import * as m2025070901 from "../../migrations/2025070901_add_version_to_note";
import * as m2025070902 from "../../migrations/2025070902_create_cvr_table";
import * as m2025071001 from "../../migrations/2025071001_alter_cvr_pk_to_bigserial";

export const centralMigrationObjects: Record<string, Migration> = {
  "2025062601_create_user": { up: m2025062601.up, down: m2025062601.down },
  "2025062602_create_note": { up: m2025062602.up, down: m2025062602.down },
  "2025062603_create_tag": { up: m2025062603.up, down: m2025062603.down },
  "2025062604_create_note_tag": {
    up: m2025062604.up,
    down: m2025062604.down,
  },
  "2025062701_create_session": {
    up: m2025062701.up,
    down: m2025062701.down,
  },
  "2025062702_add_permissions_to_user": {
    up: m2025062702.up,
    down: m2025062702.down,
  },
  "2025062801_add_avatar_to_user": {
    up: m2025062801.up,
    down: m2025062801.down,
  },
  "2025063001_create_password_reset_token": {
    up: m2025063001.up,
    down: m2025063001.down,
  },
  "2025063002_create_email_verification_token": {
    up: m2025063002.up,
    down: m2025063002.down,
  },
  "2025063003_add_email_verified_to_user": {
    up: m2025063003.up,
    down: m2025063003.down,
  },
  "2025070201_create_block": { up: m2025070201.up, down: m2025070201.down },
  "2025070203_add_replicache_tables": {
    up: m2025070203.up,
    down: m2025070203.down,
  },
  "2025070301_add_note_id_to_block": {
    up: m2025070301.up,
    down: m2025070301.down,
  },
  "2025070401_create_change_log": {
    up: m2025070401.up,
    down: m2025070401.down,
  },
  "2025070901_add_version_to_note": {
    up: m2025070901.up,
    down: m2025070901.down,
  },
  "2025070902_create_cvr_table": {
    up: m2025070902.up,
    down: m2025070902.down,
  },
  "2025071001_alter_cvr_pk_to_bigserial": {
    up: m2025071001.up,
    down: m2025071001.down,
  },
};
