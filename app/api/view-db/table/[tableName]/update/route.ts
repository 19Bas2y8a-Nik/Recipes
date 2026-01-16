import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma-factory'
import { DbType } from '@/lib/db-config'
import { getCurrentUserId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      )
    }

    const prisma = getPrismaClient(dbType)

    // Строим SQL запрос для обновления
    const setClause = Object.keys(updateData)
      .map((key, idx) => `"${key}" = $${idx + 1}`)
      .join(', ')

    const values = Object.values(updateData).map(val => val === null ? null : val)
    const query = `UPDATE "${tableName}" SET ${setClause} WHERE "id" = $${values.length + 1} RETURNING *`

    const result = await prisma.$queryRawUnsafe(query, ...values, id) as any[]

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json(
      { error: 'Failed to update record', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
