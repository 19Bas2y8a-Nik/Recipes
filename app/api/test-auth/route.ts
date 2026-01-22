import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Проверяем переменные окружения
    const envCheck = {
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // Проверяем подключение к базе данных
    let dbConnected = false
    let dbError = null
    try {
      await prisma.$connect()
      await prisma.$queryRaw`SELECT 1`
      dbConnected = true
      await prisma.$disconnect()
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Неизвестная ошибка'
    }

    // Проверяем наличие таблиц
    let tablesExist = false
    let tablesError = null
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `
      tablesExist = tables.some(t => ['users', 'accounts', 'sessions'].includes(t.tablename))
      tablesError = tables.length === 0 ? 'Таблицы не найдены' : null
    } catch (error) {
      tablesError = error instanceof Error ? error.message : 'Неизвестная ошибка'
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      database: {
        connected: dbConnected,
        error: dbError,
        tablesExist,
        tablesError,
      },
      message: 'Проверка конфигурации завершена',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        stack: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : undefined)
          : undefined,
      },
      { status: 500 }
    )
  }
}
