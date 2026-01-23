import { prisma } from '@/lib/prisma'
import { RecipesList } from '@/components/recipes-list'
import { RecipeSearchClient } from '@/components/recipe-search-client'
import { getCurrentUserId } from '@/lib/auth'

async function getPublicRecipes(search?: string, sort: 'popular' | 'recent' = 'recent', userId?: string) {
  const where: any = {
    visibility: 'PUBLIC',
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  const recipes = await prisma.recip.findMany({
    where,
    orderBy: sort === 'popular' 
      ? { createdAt: 'desc' as const } // Временно, сортировка по популярности будет применена после
      : { createdAt: 'desc' as const },
    take: sort === 'popular' ? 50 : 10, // Для популярных берем больше, чтобы отсортировать
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      ...(userId ? {
        likes: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      } : {}),
    },
  })

  // Преобразуем и сортируем
  const recipesWithLikes = recipes.map(recipe => ({
    ...recipe,
    likesCount: recipe._count.likes,
    likedByMe: userId ? recipe.likes.length > 0 : false,
  }))

  // Сортируем по популярности, если нужно
  if (sort === 'popular') {
    recipesWithLikes.sort((a, b) => b.likesCount - a.likesCount)
    return recipesWithLikes.slice(0, 10)
  }

  return recipesWithLikes
}

export default async function PublicRecipesPage({
  searchParams,
}: {
  searchParams: { search?: string; sort?: 'popular' | 'recent' }
}) {
  const userId = await getCurrentUserId()
  const sort = (searchParams.sort === 'popular' || searchParams.sort === 'recent') 
    ? searchParams.sort 
    : 'recent'
  const recipes = await getPublicRecipes(searchParams.search, sort, userId)

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
          <div className="flex items-center gap-4 mb-4">
            <div className="max-w-md flex-1">
              <RecipeSearchClient />
            </div>
            <div className="flex gap-2">
              <a
                href={`/dashboard/public?sort=popular${searchParams.search ? `&search=${encodeURIComponent(searchParams.search)}` : ''}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sort === 'popular'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Популярные
              </a>
              <a
                href={`/dashboard/public?sort=recent${searchParams.search ? `&search=${encodeURIComponent(searchParams.search)}` : ''}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sort === 'recent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Новые
              </a>
            </div>
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
          likesCount: r.likesCount,
          likedByMe: r.likedByMe,
        }))} />
      </div>
    </div>
  )
}
