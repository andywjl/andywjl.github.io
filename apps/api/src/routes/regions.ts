import type { FastifyInstance } from "fastify";
import { regionService } from "../services/region-service";

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

export async function registerRegionRoutes(app: FastifyInstance) {
  app.get("/regions", async () => {
    const items = await regionService.list();
    return ok(items);
  });
}
