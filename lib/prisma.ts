import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// В serverless окружениях (Vercel) сохраняем экземпляр в global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  // В production также используем singleton для избежания множественных соединений
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma
  }
}
