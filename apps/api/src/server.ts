import Fastify from "fastify";

const app = Fastify();

app.get("/api/v1/health", async () => {
  return {
    code: 0,
    data: { ok: true },
    msg: "ok",
  };
});

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
