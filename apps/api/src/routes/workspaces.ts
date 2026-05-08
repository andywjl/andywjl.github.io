import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import {
  workspaceService,
  type WorkspaceStatus,
} from "../services/workspace-service";

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

type ErrorPayload = {
  code: number;
  data: null;
  msg: string;
};

function fail(code: number, msg: string): ErrorPayload {
  return {
    code,
    data: null,
    msg,
  };
}

export async function registerWorkspaceRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      region?: string;
      country?: string;
      city?: string;
      status?: WorkspaceStatus;
      minSeats?: string;
      leaseExpireBefore?: string;
      keyword?: string;
      tags?: string;
      page?: string;
      pageSize?: string;
    };
  }>("/workspaces", async (request) => {
    const tags =
      request.query.tags
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean) ?? [];

    const result = await workspaceService.find({
      region: request.query.region,
      country: request.query.country,
      city: request.query.city,
      status: request.query.status,
      minSeats: request.query.minSeats
        ? Number(request.query.minSeats)
        : undefined,
      leaseExpireBefore: request.query.leaseExpireBefore,
      keyword: request.query.keyword,
      tags: tags.length > 0 ? tags : undefined,
      page: request.query.page ? Number(request.query.page) : undefined,
      pageSize: request.query.pageSize
        ? Number(request.query.pageSize)
        : undefined,
    });

    return ok(result);
  });

  app.get<{ Params: { id: string } }>("/workspaces/:id", async (request, reply) => {
    const workspace = await prisma.workspace.findUnique({
      where: { id: request.params.id },
    });

    if (!workspace) {
      reply.code(404);
      return fail(404, "workspace not found");
    }

    return ok(workspace);
  });
}
