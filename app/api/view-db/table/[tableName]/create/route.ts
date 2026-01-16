import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma-factory'
import { DbType } from '@/lib/db-config'
import { getCurrentUserId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const tableName = params.tableName
    const body = await request.json()

    const prisma = getPrismaClient(dbType)

    // Строим SQL запрос для вставки
    const columns = Object.keys(body).map(col => `"${col}"`).join(', ')
    const placeholders = Object.keys(body)
      .map((_, idx) => `$${idx + 1}`)
      .join(', ')

    const values = Object.values(body).map(val => val === null ? null : val)

    const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`

    const result = await prisma.$queryRawUnsafe(query, ...values) as any[]

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: 'Failed to create record', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
