-- CreateEnum
CREATE TYPE "SavedItemScope" AS ENUM ('PERSONAL', 'COMPANY');

-- AlterTable
ALTER TABLE "saved_items" ADD COLUMN "company_id" CHAR(36);
ALTER TABLE "saved_items" ADD COLUMN "scope" "SavedItemScope" NOT NULL DEFAULT 'PERSONAL';

-- CreateIndex
CREATE INDEX "saved_items_company_id_target_type_scope_idx" ON "saved_items"("company_id", "target_type", "scope");

-- CreateIndex
CREATE INDEX "saved_items_user_id_target_type_scope_idx" ON "saved_items"("user_id", "target_type", "scope");

-- Keep one active company-pool row per candidate/company.
CREATE UNIQUE INDEX "saved_items_company_candidate_active_key"
ON "saved_items"("company_id", "target_id")
WHERE "scope" = 'COMPANY' AND "target_type" = 'CANDIDATE' AND "is_deleted" = false;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
