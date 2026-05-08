import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWorkspaceWhere,
  createWorkspaceService,
  type WorkspaceWhereInput,
} from "./workspace-service";

test("buildWorkspaceWhere includes all provided filters", () => {
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

  assert.equal(where.countryId, "CHN");
  assert.equal(where.city, "北京");
  assert.equal(where.status, "ACTIVE");
  assert.deepEqual(where.seatCount, { gte: 100 });
  assert.deepEqual(where.tags, { hasSome: ["核心", "总部"] });
  assert.ok(where.country);
  assert.ok(where.leaseEndDate);
  assert.ok(where.OR);
});

test("buildWorkspaceWhere rejects invalid leaseExpireBefore", () => {
  assert.throws(
    () => buildWorkspaceWhere({ leaseExpireBefore: "bad-date" }),
    /Invalid leaseExpireBefore date/,
  );
});

test("workspaceService.find applies pagination and returns list payload", async () => {
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

  assert.ok(capturedWhere);
  assert.equal(capturedSkip, 10);
  assert.equal(capturedTake, 10);
  assert.equal(result.total, 3);
  assert.equal(result.page, 2);
  assert.equal(result.pageSize, 10);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].name, "北京中心");
});
