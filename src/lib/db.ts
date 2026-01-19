import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please add it to your .env.local file.\n" +
    "Example: DATABASE_URL=\"postgresql://user:password@host:5432/dbname\""
  )
}

// Global is used here to maintain a cached connection across hot reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Create connection pool (reuse in development to avoid too many connections)
const pool = globalForPrisma.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool
}

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool)

// Initialize Prisma Client with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
