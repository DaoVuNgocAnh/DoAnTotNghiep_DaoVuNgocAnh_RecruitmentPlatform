-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "employer_action_by_id" CHAR(36);

-- CreateTable
CREATE TABLE "job_assignees" (
    "id" CHAR(36) NOT NULL,
    "job_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "assigned_by_id" CHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_assignees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_histories" (
    "id" CHAR(36) NOT NULL,
    "application_id" CHAR(36) NOT NULL,
    "actor_id" CHAR(36) NOT NULL,
    "old_status" "ApplicationStatus",
    "new_status" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_assignees_user_id_idx" ON "job_assignees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_assignees_job_id_user_id_key" ON "job_assignees"("job_id", "user_id");

-- CreateIndex
CREATE INDEX "application_histories_application_id_idx" ON "application_histories"("application_id");

-- CreateIndex
CREATE INDEX "application_histories_actor_id_idx" ON "application_histories"("actor_id");

-- AddForeignKey
ALTER TABLE "job_assignees" ADD CONSTRAINT "job_assignees_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_assignees" ADD CONSTRAINT "job_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_assignees" ADD CONSTRAINT "job_assignees_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_employer_action_by_id_fkey" FOREIGN KEY ("employer_action_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_histories" ADD CONSTRAINT "application_histories_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_histories" ADD CONSTRAINT "application_histories_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill existing jobs so the creator keeps assignment-based access after this migration.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO "job_assignees" ("id", "job_id", "user_id", "assigned_by_id")
SELECT gen_random_uuid()::text, "id", "created_by", "created_by"
FROM "jobs"
WHERE "created_by" IS NOT NULL
ON CONFLICT ("job_id", "user_id") DO NOTHING;
