-- Safe backfill for environments where the assignment migration already ran.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO "job_assignees" ("id", "job_id", "user_id", "assigned_by_id")
SELECT gen_random_uuid()::text, "id", "created_by", "created_by"
FROM "jobs"
WHERE "created_by" IS NOT NULL
ON CONFLICT ("job_id", "user_id") DO NOTHING;
