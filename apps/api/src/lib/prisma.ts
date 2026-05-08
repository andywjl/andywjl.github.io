type PrismaClientLike = {
  region: {
    findMany: (args: unknown) => Promise<unknown[]>;
  };
  country: {
    findMany: (args: unknown) => Promise<unknown[]>;
  };
  workspace: {
    count: (args: { where: unknown }) => Promise<number>;
    findMany: (args: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown | null>;
  };
};

function createPrismaClient(): PrismaClientLike {
  // Reuse generated Prisma client from shared package in M1-A/M1-B.
  // This keeps M1-C file scope inside apps/api/src/**.
  const { PrismaClient } = require("../../../../packages/shared/node_modules/@prisma/client") as {
    PrismaClient: new (args?: unknown) => PrismaClientLike;
  };
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
