-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "draft_data" TEXT,
ADD COLUMN     "is_draft" BOOLEAN NOT NULL DEFAULT false;
