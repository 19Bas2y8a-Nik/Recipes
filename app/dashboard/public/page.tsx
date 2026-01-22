import { prisma } from '@/lib/prisma'
import { RecipesList } from '@/components/recipes-list'
import { RecipeSearchClient } from '@/components/recipe-search-client'

async function getPublicRecipes(search?: string) {
  const where: any = {
    visibility: 'PUBLIC',
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
      createdAt: 'desc',
    },
    take: 10,
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export default async function PublicRecipesPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const recipes = await getPublicRecipes(searchParams.search)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">Публичные рецепты</h1>
            <p className="text-muted-foreground mt-1">
              Рецепты, доступные всем пользователям
            </p>
          </div>
          <div className="max-w-md">
            <RecipeSearchClient />
          </div>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-6">
        <RecipesList recipes={recipes.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          visibility: r.visibility,
          isFavorite: r.isFavorite,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }))} />
      </div>
    </div>
  )
}
