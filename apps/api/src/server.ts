import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerRegionRoutes } from "./routes/regions";
import { registerCountryRoutes } from "./routes/countries";
import { registerWorkspaceRoutes } from "./routes/workspaces";

const app = Fastify();
void app.register(cors, { origin: true });

app.get("/api/v1/health", async () => {
  return {
    code: 0,
    data: { ok: true },
    msg: "ok",
  };
});

app.register(async (instance) => {
  await registerRegionRoutes(instance);
  await registerCountryRoutes(instance);
  await registerWorkspaceRoutes(instance);
}, { prefix: "/api/v1" });

const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.API_PORT ?? 3000);
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
