import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma-factory'
import { DbType } from '@/lib/db-config'
import { getCurrentUserId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function DELETE(
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for delete' },
        { status: 400 }
      )
    }

    const prisma = getPrismaClient(dbType)

    const query = `DELETE FROM "${tableName}" WHERE "id" = $1 RETURNING *`
    const result = await prisma.$queryRawUnsafe(query, id) as any[]

    return NextResponse.json({ success: true, deleted: result[0] })
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: 'Failed to delete record', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
