/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'BLACKLISH');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'INTERVIEW', 'REJECTED', 'ACCEPTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('JOB', 'CANDIDATE');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(36) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "avatar_url" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(36),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" CHAR(36) NOT NULL,
    "company_name" TEXT NOT NULL,
    "tax_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website_url" TEXT,
    "logo_url" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" CHAR(36) NOT NULL,
    "created_by" CHAR(36),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "join_requests" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "company_id" CHAR(36) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_categories" (
    "id" CHAR(36) NOT NULL,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" CHAR(36) NOT NULL,
    "category_id" CHAR(36) NOT NULL,
    "company_id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "salary" VARCHAR(100) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(36),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" CHAR(36) NOT NULL,
    "candidate_id" CHAR(36) NOT NULL,
    "resume_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" CHAR(36) NOT NULL,
    "job_id" CHAR(36) NOT NULL,
    "candidate_id" CHAR(36) NOT NULL,
    "resume_id" CHAR(36) NOT NULL,
    "apply_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "employer_note" TEXT,
    "employer_action_date" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" CHAR(36) NOT NULL,
    "application_id" CHAR(36) NOT NULL,
    "interview_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "created_by_employer_id" CHAR(36) NOT NULL,
    "response_date" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_items" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "target_id" CHAR(36) NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36),
    "action_type" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "description" TEXT,
    "action_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_tax_code_key" ON "companies"("tax_code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_owner_id_key" ON "companies"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "join_requests_user_id_company_id_key" ON "join_requests"("user_id", "company_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "job_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_created_by_employer_id_fkey" FOREIGN KEY ("created_by_employer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
