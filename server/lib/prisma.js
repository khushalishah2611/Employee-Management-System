import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";
import { PrismaMySQL } from "@prisma/adapter-mysql";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaMySQL(
      mysql.createPool(process.env.DATABASE_URL)
    ),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
