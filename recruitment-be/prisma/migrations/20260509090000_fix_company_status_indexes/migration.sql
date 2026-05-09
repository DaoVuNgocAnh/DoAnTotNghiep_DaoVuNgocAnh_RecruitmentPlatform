-- Rename misspelled company status enum value.
ALTER TYPE "CompanyStatus" RENAME VALUE 'BLACKLISH' TO 'BLACKLIST';

-- Keep one active application per candidate/job while preserving soft-deleted history.
CREATE UNIQUE INDEX "applications_active_candidate_job_key"
ON "applications"("job_id", "candidate_id")
WHERE "is_deleted" = false;

-- Indexes for common job listing, admin review, and employer dashboard queries.
CREATE INDEX "users_company_id_role_is_deleted_created_at_idx"
ON "users"("company_id", "role", "is_deleted", "created_at");

CREATE INDEX "companies_status_is_deleted_created_at_idx"
ON "companies"("status", "is_deleted", "created_at");

CREATE INDEX "companies_status_is_deleted_is_premium_idx"
ON "companies"("status", "is_deleted", "is_premium");

CREATE INDEX "join_requests_company_id_status_created_at_idx"
ON "join_requests"("company_id", "status", "created_at");

CREATE INDEX "join_requests_user_id_status_idx"
ON "join_requests"("user_id", "status");

CREATE INDEX "jobs_status_is_deleted_category_id_created_at_idx"
ON "jobs"("status", "is_deleted", "category_id", "created_at");

CREATE INDEX "jobs_company_id_is_deleted_created_at_idx"
ON "jobs"("company_id", "is_deleted", "created_at");

CREATE INDEX "jobs_status_is_deleted_created_at_idx"
ON "jobs"("status", "is_deleted", "created_at");

CREATE INDEX "jobs_is_featured_created_at_idx"
ON "jobs"("is_featured", "created_at");

CREATE INDEX "applications_candidate_id_is_deleted_apply_date_idx"
ON "applications"("candidate_id", "is_deleted", "apply_date");

CREATE INDEX "applications_job_id_is_deleted_apply_date_idx"
ON "applications"("job_id", "is_deleted", "apply_date");

CREATE INDEX "applications_status_is_deleted_idx"
ON "applications"("status", "is_deleted");
