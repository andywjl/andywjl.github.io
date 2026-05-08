import { describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import {
  buildWorkspaceWhere,
  createWorkspaceService,
  workspaceService,
  type WorkspaceWhereInput,
} from "./workspace-service";

describe("workspaceService", () => {
  it("buildWorkspaceWhere includes all provided filters", () => {
    const where = buildWorkspaceWhere({
      region: "CN",
      country: "CHN",
      city: "北京",
      status: "ACTIVE",
      minSeats: 100,
      leaseExpireBefore: "2027-12-31",
      keyword: "Tower",
      tags: ["核心", "总部"],
    });

    expect(where.countryId).toBe("CHN");
    expect(where.city).toBe("北京");
    expect(where.status).toBe("ACTIVE");
    expect(where.seatCount).toEqual({ gte: 100 });
    expect(where.tags).toEqual({ hasSome: ["核心", "总部"] });
    expect(where.country).toBeDefined();
    expect(where.leaseEndDate).toBeDefined();
    expect(where.OR).toBeDefined();
  });

  it("buildWorkspaceWhere rejects invalid leaseExpireBefore", () => {
    expect(() =>
      buildWorkspaceWhere({ leaseExpireBefore: "bad-date" }),
    ).toThrow(/Invalid leaseExpireBefore date/);
  });

  it("workspaceService.find applies pagination and returns list payload", async () => {
    let capturedWhere: WorkspaceWhereInput | undefined;
    let capturedSkip = -1;
    let capturedTake = -1;

    const service = createWorkspaceService({
      count: async (where) => {
        capturedWhere = where;
        return 3;
      },
      findMany: async ({ where, skip, take }) => {
        capturedWhere = where;
        capturedSkip = skip;
        capturedTake = take;
        return [
          {
            id: "ws_1",
            code: "PEK01",
            name: "北京中心",
            countryId: "CHN",
            city: "北京",
            address: "北京市海淀区",
            lat: 39.9,
            lng: 116.3,
            status: "ACTIVE",
            seatCount: 180,
            leaseEndDate: null,
            tags: ["核心"],
          },
        ];
      },
    });

    const result = await service.find({
      page: 2,
      pageSize: 10,
      keyword: "北京",
    });

    expect(capturedWhere).toBeDefined();
    expect(capturedSkip).toBe(10);
    expect(capturedTake).toBe(10);
    expect(result.total).toBe(3);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("北京中心");
  });

  it("workspaceService default implementation calls prisma methods", async () => {
    const originalCount = prisma.workspace.count;
    const originalFindMany = prisma.workspace.findMany;

    prisma.workspace.count = async () => 1;
    prisma.workspace.findMany = async () => [
      {
        id: "ws_2",
        code: "SIN01",
        name: "Singapore Workspace",
        countryId: "SGP",
        city: "新加坡",
        address: "Marina Bay",
        lat: 1.28,
        lng: 103.85,
        status: "ACTIVE",
        seatCount: 120,
        leaseEndDate: null,
        tags: [],
      },
    ];

    try {
      const result = await workspaceService.find({
        keyword: "Singapore",
        page: 1,
        pageSize: 20,
      });
      expect(result.total).toBe(1);
      expect(result.items[0].code).toBe("SIN01");
    } finally {
      prisma.workspace.count = originalCount;
      prisma.workspace.findMany = originalFindMany;
    }
  });
});
