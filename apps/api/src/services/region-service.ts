import { prisma } from "../lib/prisma";

export type RegionListItem = {
  id: string;
  nameZh: string;
  nameEn: string;
  countryCount: number;
  workspaceCount: number;
};

type RegionRow = {
  id: string;
  nameZh: string;
  nameEn: string;
  countries: Array<{
    _count: {
      workspaces: number;
    };
  }>;
};

type RegionServiceDeps = {
  listRegionRows: () => Promise<RegionRow[]>;
};

function toRegionListItem(row: RegionRow): RegionListItem {
  return {
    id: row.id,
    nameZh: row.nameZh,
    nameEn: row.nameEn,
    countryCount: row.countries.length,
    workspaceCount: row.countries.reduce(
      (sum, country) => sum + country._count.workspaces,
      0,
    ),
  };
}

export function createRegionService(deps: RegionServiceDeps) {
  return {
    async list(): Promise<RegionListItem[]> {
      const rows = await deps.listRegionRows();
      return rows.map(toRegionListItem);
    },
  };
}

export const regionService = createRegionService({
  listRegionRows: async () =>
    (await prisma.region.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nameZh: true,
        nameEn: true,
        countries: {
          select: {
            _count: {
              select: {
                workspaces: true,
              },
            },
          },
        },
      },
    })) as RegionRow[],
});
