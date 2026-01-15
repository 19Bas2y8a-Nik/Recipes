import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma-factory'
import { DbType } from '@/lib/db-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType

    const prisma = getPrismaClient(dbType)

    // Получаем список таблиц через raw query
    const tables = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
      `SELECT tablename 
       FROM pg_tables 
       WHERE schemaname = 'public'
       ORDER BY tablename`
    )

    return NextResponse.json({ 
      tables: tables.map(t => t.tablename),
      dbType 
    })
  } catch (error) {
    console.error('Error fetching tables:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tables', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}
