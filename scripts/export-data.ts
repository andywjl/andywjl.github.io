/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const { PrismaClient } = require("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

async function main() {
  const outDir = path.join(process.cwd(), "src", "data");

  const campuses = await prisma.campus.findMany({ orderBy: { name: "asc" } });
  const equipment = await prisma.equipment.findMany({ orderBy: { updatedAt: "desc" } });
  const issues = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } });
  const metricDefs = await prisma.metricDefinition.findMany({ orderBy: { goal: "asc" } });
  const metricRecords = await prisma.metricRecord.findMany({ orderBy: { recordedAt: "desc" } });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  const maintenances = await prisma.maintenance.findMany({ orderBy: { date: "desc" } });
  const faults = await prisma.fault.findMany({ orderBy: { occurredAt: "desc" } });

  const data = {
    campuses,
    equipment,
    issues,
    metricDefinitions: metricDefs,
    metricRecords,
    projects,
    maintenances,
    faults,
  };

  fs.writeFileSync(path.join(outDir, "db.json"), JSON.stringify(data, null, 2));
  console.log("Exported all data to src/data/db.json");
  console.log(`  Campuses: ${campuses.length}`);
  console.log(`  Equipment: ${equipment.length}`);
  console.log(`  Issues: ${issues.length}`);
  console.log(`  MetricDefinitions: ${metricDefs.length}`);
  console.log(`  MetricRecords: ${metricRecords.length}`);
  console.log(`  Projects: ${projects.length}`);
  console.log(`  Maintenances: ${maintenances.length}`);
  console.log(`  Faults: ${faults.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
