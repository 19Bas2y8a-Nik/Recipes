// Конфигурация для разных баз данных
export const DB_CONFIG = {
  local: {
    name: 'Локальная БД',
    url: process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL || '',
  },
  production: {
    name: 'Рабочая БД',
    url: process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL || '',
  },
} as const

// Проверка доступности БД
export function isDbAvailable(dbType: DbType): boolean {
  return !!DB_CONFIG[dbType].url
}

export type DbType = keyof typeof DB_CONFIG

export function getDatabaseUrl(dbType: DbType): string {
  return DB_CONFIG[dbType].url
}
