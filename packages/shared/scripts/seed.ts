import { PrismaClient, WorkspaceStatus } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RegionSeed = {
  id: string;
  nameZh: string;
  nameEn: string;
};

type CountrySeed = {
  id: string;
  nameZh: string;
  nameEn: string;
  regionId: string;
  centerLng: number;
  centerLat: number;
};

type WorkspaceSeed = {
  code: string;
  name: string;
  countryId: string;
  province: string | null;
  city: string;
  district: string | null;
  address: string;
  buildingName: string | null;
  floor: string | null;
  lng: number;
  lat: number;
  leaseStartDate: string | null;
  deliveryDate: string | null;
  moveInDate: string | null;
  leaseEndDate: string | null;
  actualEndDate: string | null;
  floorStatus: string | null;
  status: WorkspaceStatus;
  seatCount: number;
  allocatedSeats: number | null;
  leasedAreaSqm: number | null;
  decoratedAreaSqm: number | null;
  usableAreaSqm: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  description: string | null;
  tags: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDir = path.resolve(__dirname, "../seed");
const prisma = new PrismaClient();

async function readJson<T>(name: string): Promise<T> {
  const content = await readFile(path.join(seedDir, name), "utf-8");
  return JSON.parse(content) as T;
}

function assertExpectedCounts(
  regions: RegionSeed[],
  countries: CountrySeed[],
  workspaces: WorkspaceSeed[],
) {
  if (regions.length !== 4) {
    throw new Error(`Expected 4 regions, got ${regions.length}`);
  }
  if (countries.length !== 44) {
    throw new Error(`Expected 44 countries, got ${countries.length}`);
  }
  if (workspaces.length !== 215) {
    throw new Error(`Expected 215 workspaces, got ${workspaces.length}`);
  }

  const singaporeCount = workspaces.filter(
    (item) =>
      item.city.toLowerCase().includes("singapore") ||
      item.city.includes("新加坡"),
  ).length;
  if (singaporeCount !== 5) {
    throw new Error(`Expected 5 Singapore workspaces, got ${singaporeCount}`);
  }
}

async function main() {
  const regions = await readJson<RegionSeed[]>("regions.json");
  const countries = await readJson<CountrySeed[]>("countries.json");
  const workspaces = await readJson<WorkspaceSeed[]>("workspaces.json");

  assertExpectedCounts(regions, countries, workspaces);

  const validCountryIds = new Set(countries.map((country) => country.id));
  for (const workspace of workspaces) {
    if (!validCountryIds.has(workspace.countryId)) {
      throw new Error(`Workspace countryId not found: ${workspace.countryId}`);
    }
    if (!workspace.code) {
      throw new Error(`Workspace code is required: ${workspace.name}`);
    }
  }

  await prisma.$transaction([
    prisma.workspace.deleteMany(),
    prisma.country.deleteMany(),
    prisma.region.deleteMany(),
  ]);

  await prisma.region.createMany({ data: regions });
  await prisma.country.createMany({ data: countries });
  await prisma.workspace.createMany({
    data: workspaces.map((workspace) => ({
      ...workspace,
      leaseStartDate: workspace.leaseStartDate
        ? new Date(workspace.leaseStartDate)
        : null,
      deliveryDate: workspace.deliveryDate
        ? new Date(workspace.deliveryDate)
        : null,
      moveInDate: workspace.moveInDate ? new Date(workspace.moveInDate) : null,
      leaseEndDate: workspace.leaseEndDate
        ? new Date(workspace.leaseEndDate)
        : null,
      actualEndDate: workspace.actualEndDate
        ? new Date(workspace.actualEndDate)
        : null,
    })),
  });

  console.log(`Seeded regions: ${regions.length}`);
  console.log(`Seeded countries: ${countries.length}`);
  console.log(`Seeded workspaces: ${workspaces.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
