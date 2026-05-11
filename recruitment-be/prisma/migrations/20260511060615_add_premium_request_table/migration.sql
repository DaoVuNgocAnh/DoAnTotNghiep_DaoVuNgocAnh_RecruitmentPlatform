-- CreateEnum
CREATE TYPE "PremiumRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "premium_requests" (
    "id" CHAR(36) NOT NULL,
    "company_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "status" "PremiumRequestStatus" NOT NULL DEFAULT 'PENDING',
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "premium_requests" ADD CONSTRAINT "premium_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_requests" ADD CONSTRAINT "premium_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
