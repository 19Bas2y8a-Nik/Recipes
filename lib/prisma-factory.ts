import { PrismaClient } from '@prisma/client'
import { DbType, getDatabaseUrl } from './db-config'

// Кэш для разных Prisma клиентов
const prismaClients: Map<string, PrismaClient> = new Map()

export function getPrismaClient(dbType: DbType): PrismaClient {
  const url = getDatabaseUrl(dbType)
  const cacheKey = `${dbType}:${url}`
  
  if (!prismaClients.has(cacheKey)) {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: url,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    prismaClients.set(cacheKey, client)
  }
  
  return prismaClients.get(cacheKey)!
}

// Получить список всех моделей из Prisma схемы
export const PRISMA_MODELS = [
  'User',
  'Note',
  'Category',
  'Recip',
  'Tag',
  'TagOnRecip',
  'Vote',
  'Collection',
  'RecipInCollection',
  'RecipVersion',
] as const

export type PrismaModel = typeof PRISMA_MODELS[number]
