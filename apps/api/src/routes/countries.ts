import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import type { WorkspaceStatus } from "../services/workspace-service";

type OkPayload<T> = {
  code: 0;
  data: T;
  msg: "ok";
};

function ok<T>(data: T): OkPayload<T> {
  return {
    code: 0,
    data,
    msg: "ok",
  };
}

export async function registerCountryRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { region?: string } }>(
    "/countries",
    async (request) => {
      const rows = (await prisma.country.findMany({
        where: request.query.region
          ? { regionId: request.query.region }
          : undefined,
        orderBy: { id: "asc" },
        select: {
          id: true,
          nameZh: true,
          nameEn: true,
          regionId: true,
          centerLng: true,
          centerLat: true,
          _count: {
            select: {
              workspaces: true,
            },
          },
        },
      })) as Array<{
        id: string;
        nameZh: string;
        nameEn: string;
        regionId: string;
        centerLng: number;
        centerLat: number;
        _count: {
          workspaces: number;
        };
      }>;

      return ok(
        rows.map((row) => ({
          id: row.id,
          nameZh: row.nameZh,
          nameEn: row.nameEn,
          regionId: row.regionId,
          centerLng: row.centerLng,
          centerLat: row.centerLat,
          workspaceCount: row._count.workspaces,
        })),
      );
    },
  );

  app.get<{
    Params: { id: string };
    Querystring: { status?: WorkspaceStatus; keyword?: string };
  }>("/countries/:id/workspaces", async (request) => {
    const keyword = request.query.keyword?.trim();
      const rows = (await prisma.workspace.findMany({
      where: {
        countryId: request.params.id,
        status: request.query.status,
        ...(keyword
          ? {
              OR: [
                { name: { contains: keyword, mode: "insensitive" } },
                { address: { contains: keyword, mode: "insensitive" } },
                { city: { contains: keyword, mode: "insensitive" } },
                { code: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      })) as unknown[];

    return ok(rows);
  });
}
