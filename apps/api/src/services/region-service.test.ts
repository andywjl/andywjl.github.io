import test from "node:test";
import assert from "node:assert/strict";
import { createRegionService } from "./region-service";

test("regionService.list aggregates country and workspace counts", async () => {
  const service = createRegionService({
    listRegionRows: async () => [
      {
        id: "CN",
        nameZh: "中国",
        nameEn: "China",
        countries: [{ _count: { workspaces: 10 } }, { _count: { workspaces: 4 } }],
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

  assert.deepEqual(result, [
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
