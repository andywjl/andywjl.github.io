import { prisma } from "../lib/prisma";

export type WorkspaceStatus = "ACTIVE" | "PLANNING" | "CLOSED";

export type WorkspaceWhereInput = {
  country?: { regionId: string };
  countryId?: string;
  city?: string;
  status?: WorkspaceStatus;
  seatCount?: { gte: number };
  leaseEndDate?: { lte: Date };
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    city?: { contains: string; mode: "insensitive" };
    address?: { contains: string; mode: "insensitive" };
    code?: { contains: string; mode: "insensitive" };
  }>;
  tags?: { hasSome: string[] };
};

export type WorkspaceFindFilters = {
  region?: string;
  country?: string;
  city?: string;
  status?: WorkspaceStatus;
  minSeats?: number;
  leaseExpireBefore?: string;
  keyword?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
};

export type WorkspaceListItem = {
  id: string;
  code: string | null;
  name: string;
  countryId: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: WorkspaceStatus;
  seatCount: number;
  leaseEndDate: Date | null;
  tags: string[];
};

export type WorkspaceListResult = {
  items: WorkspaceListItem[];
  total: number;
  page: number;
  pageSize: number;
};

type WorkspaceQueryArgs = {
  where: WorkspaceWhereInput;
  skip: number;
  take: number;
};

type WorkspaceServiceDeps = {
  count: (where: WorkspaceWhereInput) => Promise<number>;
  findMany: (args: WorkspaceQueryArgs) => Promise<WorkspaceListItem[]>;
};

function normalizePage(value: number | undefined): number {
  if (!value || Number.isNaN(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function normalizePageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value)) return 20;
  return Math.max(1, Math.min(100, Math.floor(value)));
}

export function buildWorkspaceWhere(
  filters: WorkspaceFindFilters,
): WorkspaceWhereInput {
  const where: WorkspaceWhereInput = {};

  if (filters.region) {
    where.country = { regionId: filters.region };
  }

  if (filters.country) {
    where.countryId = filters.country;
  }

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (typeof filters.minSeats === "number") {
    where.seatCount = { gte: filters.minSeats };
  }

  if (filters.leaseExpireBefore) {
    const parsed = new Date(filters.leaseExpireBefore);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid leaseExpireBefore date");
    }
    where.leaseEndDate = { lte: parsed };
  }

  const keyword = filters.keyword?.trim();
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { city: { contains: keyword, mode: "insensitive" } },
      { address: { contains: keyword, mode: "insensitive" } },
      { code: { contains: keyword, mode: "insensitive" } },
    ];
  }

  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  return where;
}

export function createWorkspaceService(deps: WorkspaceServiceDeps) {
  return {
    async find(filters: WorkspaceFindFilters): Promise<WorkspaceListResult> {
      const page = normalizePage(filters.page);
      const pageSize = normalizePageSize(filters.pageSize);
      const skip = (page - 1) * pageSize;
      const where = buildWorkspaceWhere(filters);

      const [total, items] = await Promise.all([
        deps.count(where),
        deps.findMany({ where, skip, take: pageSize }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
      };
    },
  };
}

export const workspaceService = createWorkspaceService({
  count: async (where) => prisma.workspace.count({ where }),
  findMany: async ({ where, skip, take }) =>
    (await prisma.workspace.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        name: true,
        countryId: true,
        city: true,
        address: true,
        lat: true,
        lng: true,
        status: true,
        seatCount: true,
        leaseEndDate: true,
        tags: true,
      },
    })) as WorkspaceListItem[],
});
