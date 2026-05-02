-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01 00:00:00 +00:00',
ADD COLUMN     "skills" TEXT;
