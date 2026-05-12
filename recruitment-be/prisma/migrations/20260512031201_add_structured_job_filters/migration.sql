-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'REMOTE');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "is_salary_negotiable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "job_type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "salary_max" INTEGER,
ADD COLUMN     "salary_min" INTEGER;
