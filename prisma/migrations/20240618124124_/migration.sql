-- AlterTable
ALTER TABLE "SubScription" ADD COLUMN     "plan_id" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "stripe_user_id" TEXT,
ADD COLUMN     "subscription_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "freequota" INTEGER DEFAULT 50,
ADD COLUMN     "freequotaplg" INTEGER DEFAULT 50;
