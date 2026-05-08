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

type WorkspacePlan = {
  prefix: string;
  namePrefix: string;
  countryId: string;
  city: string;
  baseLat: number;
  baseLng: number;
  count: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDir = path.resolve(__dirname, "../seed");
const prisma = new PrismaClient();

async function readJson<T>(name: string): Promise<T> {
  const content = await readFile(path.join(seedDir, name), "utf-8");
  return JSON.parse(content) as T;
}

function round(value: number): number {
  return Number(value.toFixed(6));
}

function generateWorkspaces(plans: WorkspacePlan[]) {
  const items: Array<{
    id: string;
    code: string;
    name: string;
    countryId: string;
    city: string;
    address: string;
    lng: number;
    lat: number;
    status: WorkspaceStatus;
    seatCount: number;
    floor: string;
    tags: string[];
  }> = [];

  let sequence = 1;
  for (const plan of plans) {
    for (let i = 0; i < plan.count; i += 1) {
      const offsetIndex = i - Math.floor(plan.count / 2);
      const latOffset = ((offsetIndex % 11) - 5) * 0.025;
      const lngOffset = ((offsetIndex % 13) - 6) * 0.03;
      const status: WorkspaceStatus =
        sequence % 29 === 0
          ? WorkspaceStatus.CLOSED
          : sequence % 17 === 0
            ? WorkspaceStatus.PLANNING
            : WorkspaceStatus.ACTIVE;

      items.push({
        id: `ws-${String(sequence).padStart(4, "0")}`,
        code: `W${String(sequence).padStart(3, "0")}`,
        name: `${plan.namePrefix} ${i + 1}`,
        countryId: plan.countryId,
        city: plan.city,
        address: `${plan.city} ${plan.prefix} Road ${i + 1}`,
        lng: round(plan.baseLng + lngOffset),
        lat: round(plan.baseLat + latOffset),
        status,
        seatCount: 80 + (sequence % 160),
        floor: `${(sequence % 25) + 1}F`,
        tags: [plan.prefix.split("-")[0], plan.city],
      });
      sequence += 1;
    }
  }

  return items;
}

function assertExpectedCounts(
  regions: RegionSeed[],
  countries: CountrySeed[],
  workspaces: Array<{ countryId: string; city: string }>,
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

  const singaporeCount = workspaces.filter((item) =>
    item.city.toLowerCase().includes("singapore"),
  ).length;
  if (singaporeCount !== 5) {
    throw new Error(`Expected 5 Singapore workspaces, got ${singaporeCount}`);
  }
}

async function main() {
  const regions = await readJson<RegionSeed[]>("regions.json");
  const countries = await readJson<CountrySeed[]>("countries.json");
  const plans = await readJson<WorkspacePlan[]>("workspaces.json");
  const workspaces = generateWorkspaces(plans);

  assertExpectedCounts(regions, countries, workspaces);

  const validCountryIds = new Set(countries.map((country) => country.id));
  for (const workspace of workspaces) {
    if (!validCountryIds.has(workspace.countryId)) {
      throw new Error(`Workspace countryId not found: ${workspace.countryId}`);
    }
  }

  await prisma.$transaction([
    prisma.workspace.deleteMany(),
    prisma.country.deleteMany(),
    prisma.region.deleteMany(),
  ]);

  await prisma.region.createMany({ data: regions });
  await prisma.country.createMany({ data: countries });
  await prisma.workspace.createMany({ data: workspaces });

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
