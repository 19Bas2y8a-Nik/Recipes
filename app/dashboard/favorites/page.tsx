import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import { RecipesList } from '@/components/recipes-list'
import { RecipeSearchClient } from '@/components/recipe-search-client'

async function getFavoriteRecipes(userId: string, search?: string) {
  const where: any = {
    ownerId: userId,
    isFavorite: true,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  return await prisma.recip.findMany({
    where,
    orderBy: {
      updatedAt: 'desc',
    },
    take: 10,
  })
}

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const recipes = await getFavoriteRecipes(userId, searchParams.search)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">Избранное</h1>
            <p className="text-muted-foreground mt-1">
              Ваши избранные рецепты
            </p>
          </div>
          <div className="max-w-md">
            <RecipeSearchClient />
          </div>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-6">
        <RecipesList recipes={recipes} />
      </div>
    </div>
  )
}
