import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma-factory'
import { DbType } from '@/lib/db-config'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const tableName = params.tableName

    const prisma = getPrismaClient(dbType)
    const skip = (page - 1) * pageSize

    // Получаем общее количество записей
    const countResult = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(*)::int as count FROM "${tableName}"`
    )
    const total = Number(countResult[0]?.count || 0)

    // Получаем данные с пагинацией
    const data = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${tableName}" ORDER BY "id" LIMIT ${pageSize} OFFSET ${skip}`
    )

    // Получаем информацию о колонках
    const columns = await prisma.$queryRawUnsafe<Array<{
      column_name: string
      data_type: string
      is_nullable: string
    }>>(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_name = $1
       ORDER BY ordinal_position`,
      tableName
    )

    return NextResponse.json({
      data,
      columns: columns.map(c => ({
        name: c.column_name,
        type: c.data_type,
        nullable: c.is_nullable === 'YES',
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching table data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch table data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
