-- CreateTable
CREATE TABLE "DayMeta" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "markdown" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayStruct" (
    "id" TEXT NOT NULL,
    "dayMetaId" TEXT NOT NULL,
    "breakfastTotal" INTEGER NOT NULL DEFAULT 0,
    "breakfastCompleted" INTEGER NOT NULL DEFAULT 0,
    "lunchTotal" INTEGER NOT NULL DEFAULT 0,
    "lunchCompleted" INTEGER NOT NULL DEFAULT 0,
    "dinnerTotal" INTEGER NOT NULL DEFAULT 0,
    "dinnerCompleted" INTEGER NOT NULL DEFAULT 0,
    "drinksTotal" INTEGER NOT NULL DEFAULT 0,
    "drinksCompleted" INTEGER NOT NULL DEFAULT 0,
    "snacksTotal" INTEGER NOT NULL DEFAULT 0,
    "snacksCompleted" INTEGER NOT NULL DEFAULT 0,
    "exerciseTotal" INTEGER NOT NULL DEFAULT 0,
    "exerciseCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "totalCalories" INTEGER NOT NULL DEFAULT 0,
    "mood" JSONB NOT NULL DEFAULT '{}',
    "enrichmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayStruct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayMeta_date_key" ON "DayMeta"("date");

-- CreateIndex
CREATE INDEX "DayMeta_date_idx" ON "DayMeta"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DayStruct_dayMetaId_key" ON "DayStruct"("dayMetaId");

-- CreateIndex
CREATE INDEX "DayStruct_dayMetaId_idx" ON "DayStruct"("dayMetaId");

-- AddForeignKey
ALTER TABLE "DayStruct" ADD CONSTRAINT "DayStruct_dayMetaId_fkey" FOREIGN KEY ("dayMetaId") REFERENCES "DayMeta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
