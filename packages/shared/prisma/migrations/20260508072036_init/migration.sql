-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'PLANNING', 'CLOSED');

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "province" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "address" TEXT NOT NULL,
    "buildingName" TEXT,
    "floor" TEXT,
    "lng" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "leaseStartDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "moveInDate" TIMESTAMP(3),
    "leaseEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "floorStatus" TEXT,
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "seatCount" INTEGER NOT NULL DEFAULT 0,
    "allocatedSeats" INTEGER,
    "leasedAreaSqm" DOUBLE PRECISION,
    "decoratedAreaSqm" DOUBLE PRECISION,
    "usableAreaSqm" DOUBLE PRECISION,
    "ownerName" TEXT,
    "ownerEmail" TEXT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_code_key" ON "Workspace"("code");

-- CreateIndex
CREATE INDEX "Workspace_countryId_idx" ON "Workspace"("countryId");

-- CreateIndex
CREATE INDEX "Workspace_status_idx" ON "Workspace"("status");

-- CreateIndex
CREATE INDEX "Workspace_city_idx" ON "Workspace"("city");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
