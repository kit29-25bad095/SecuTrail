import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return global.prismaGlobal;
}

/**
 * Checks PostgreSQL database connectivity safely without throwing unhandled exceptions.
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const prisma = getPrismaClient();
    // Test simple lightweight query
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      latencyMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      error: errorMsg.split("\n")[0] || "Database unreachable",
    };
  }
}
