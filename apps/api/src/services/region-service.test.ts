import { describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { createRegionService, regionService } from "./region-service";

describe("regionService", () => {
  it("list aggregates country and workspace counts", async () => {
    const service = createRegionService({
      listRegionRows: async () => [
        {
          id: "CN",
          nameZh: "中国",
          nameEn: "China",
          countries: [
            { _count: { workspaces: 10 } },
            { _count: { workspaces: 4 } },
          ],
        },
        {
          id: "APAC",
          nameZh: "亚太",
          nameEn: "APAC",
          countries: [{ _count: { workspaces: 3 } }],
        },
      ],
    });

    const result = await service.list();

    expect(result).toEqual([
      {
        id: "CN",
        nameZh: "中国",
        nameEn: "China",
        countryCount: 2,
        workspaceCount: 14,
      },
      {
        id: "APAC",
        nameZh: "亚太",
        nameEn: "APAC",
        countryCount: 1,
        workspaceCount: 3,
      },
    ]);
  });

  it("regionService default implementation reads via prisma adapter", async () => {
    const original = prisma.region.findMany;
    prisma.region.findMany = async () => [
      {
        id: "EMEA",
        nameZh: "欧洲中东非洲",
        nameEn: "EMEA",
        countries: [{ _count: { workspaces: 7 } }],
      },
    ];

    try {
      const result = await regionService.list();
      expect(result[0]).toMatchObject({
        id: "EMEA",
        countryCount: 1,
        workspaceCount: 7,
      });
    } finally {
      prisma.region.findMany = original;
    }
  });
});
