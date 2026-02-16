import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const normalizedDatabaseUrl = process.env.DATABASE_URL?.replace(
  /^mariadb:\/\//,
  "mysql://"
);

if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
