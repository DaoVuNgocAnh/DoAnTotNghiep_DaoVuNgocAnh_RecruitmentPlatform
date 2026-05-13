-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "cover_url" TEXT,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "required_experience" TEXT;
