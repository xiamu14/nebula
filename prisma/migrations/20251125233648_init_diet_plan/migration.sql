-- CreateEnum
CREATE TYPE "DietCategory" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'FRUIT');

-- CreateEnum
CREATE TYPE "DietStatus" AS ENUM ('PENDING', 'DONE');

-- CreateTable
CREATE TABLE "DietPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(5,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "category" "DietCategory" NOT NULL,
    "status" "DietStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DietPlan_date_category_idx" ON "DietPlan"("date", "category");
