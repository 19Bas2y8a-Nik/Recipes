import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

async function getHistory(userId: string) {
  // TODO: Реализовать отслеживание истории
  return []
}

export default async function HistoryPage() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const history = await getHistory(userId)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">История</h1>
          <p className="text-muted-foreground mt-1">
            История ваших действий
          </p>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">История пока не реализована</p>
        </div>
      </div>
    </div>
  )
}
