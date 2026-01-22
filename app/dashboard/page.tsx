import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import { RecipesList } from '@/components/recipes-list'
import { RecipeSearchClient } from '@/components/recipe-search-client'
import { CreateRecipeButton } from '@/components/create-recipe-button'

async function getRecipes(userId: string, search?: string) {
  const where: any = {
    ownerId: userId,
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const recipes = await getRecipes(userId, searchParams.search)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Мои рецепты</h1>
              <p className="text-muted-foreground mt-1">
                Управляйте своими рецептами
              </p>
            </div>
            <CreateRecipeButton />
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
