CREATE TABLE "feedbacks" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36),
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "page_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "feedbacks_status_created_at_idx" ON "feedbacks"("status", "created_at");
CREATE INDEX "feedbacks_user_id_created_at_idx" ON "feedbacks"("user_id", "created_at");

ALTER TABLE "feedbacks"
ADD CONSTRAINT "feedbacks_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
