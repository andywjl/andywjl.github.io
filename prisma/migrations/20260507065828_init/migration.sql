-- CreateTable
CREATE TABLE "Campus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "propertyType" TEXT NOT NULL,
    "totalArea" REAL NOT NULL,
    "workstations" INTEGER NOT NULL,
    "ifmVendor" TEXT NOT NULL,
    "ifmSwitchDate" DATETIME,
    "managementTier" TEXT NOT NULL,
    "businessLines" TEXT NOT NULL DEFAULT '[]',
    "topGoals" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category1" TEXT NOT NULL,
    "category2" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "installDate" DATETIME NOT NULL,
    "designLife" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT '正常',
    "params" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL,
    "vendor" TEXT,
    "nextDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "resolvedAt" DATETIME,
    "resolution" TEXT,
    "downtime" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fault_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campusId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "nature" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "exposureObj" INTEGER NOT NULL,
    "exposureRange" INTEGER NOT NULL,
    "hasBottomLine" BOOLEAN NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '待确认',
    "solution" TEXT,
    "verifyResult" TEXT,
    "closedAt" DATETIME,
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Issue_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MetricDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "formula" TEXT,
    "unit" TEXT,
    "industryStd" TEXT,
    "companyTarget" TEXT,
    "source" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "yellowThreshold" REAL,
    "orangeThreshold" REAL,
    "redThreshold" REAL,
    "thresholdDir" TEXT NOT NULL DEFAULT 'above',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MetricRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metricId" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "recordedAt" DATETIME NOT NULL,
    "alertLevel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MetricRecord_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "MetricDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MetricRecord_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '立项',
    "expectedEffect" TEXT NOT NULL,
    "actualEffect" TEXT,
    "replicable" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Campus_name_key" ON "Campus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MetricDefinition_name_key" ON "MetricDefinition"("name");

-- CreateIndex
CREATE INDEX "MetricRecord_metricId_campusId_recordedAt_idx" ON "MetricRecord"("metricId", "campusId", "recordedAt");
