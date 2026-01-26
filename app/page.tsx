import { prisma } from '@/lib/prisma'
import { getCurrentUser, getCurrentUserId } from '@/lib/auth'
import { PublicRecipeCard } from '@/components/public-recipe-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChefHat, ArrowRight } from 'lucide-react'

async function getRecentRecipes(userId?: string, take: number = 15) {
  const recipes = await prisma.recip.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take,
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

  return recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    content: recipe.content,
    visibility: recipe.visibility,
    isFavorite: recipe.isFavorite,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    likesCount: recipe._count.likes,
    likedByMe: userId ? recipe.likes.length > 0 : false,
    owner: recipe.owner,
  }))
}

async function getPopularRecipes(userId?: string, take: number = 15) {
  // Получаем больше рецептов, чтобы отсортировать по популярности
  const recipes = await prisma.recip.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Берем больше для сортировки
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

  // Преобразуем и сортируем по популярности
  const recipesWithLikes = recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    content: recipe.content,
    visibility: recipe.visibility,
    isFavorite: recipe.isFavorite,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    likesCount: recipe._count.likes,
    likedByMe: userId ? recipe.likes.length > 0 : false,
    owner: recipe.owner,
  }))

  // Сортируем по количеству лайков (по убыванию)
  recipesWithLikes.sort((a, b) => b.likesCount - a.likesCount)
  
  return recipesWithLikes.slice(0, take)
}

export default async function Home() {
  const user = await getCurrentUser()
  const userId = await getCurrentUserId()
  
  const [recentRecipes, popularRecipes] = await Promise.all([
    getRecentRecipes(userId, 15),
    getPopularRecipes(userId, 15),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Добро пожаловать в Recipes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Откройте для себя тысячи вкусных рецептов, поделитесь своими кулинарными шедеврами и вдохновитесь новыми идеями для приготовления
          </p>
          {user ? (
            <Link href="/dashboard/create">
              <Button size="lg" className="gap-2">
                Добавить рецепт
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Добавить рецепт
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Войдите, чтобы добавлять рецепты
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Recipes Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Новые рецепты</h2>
            <Link href="/dashboard/public?sort=recent">
              <Button variant="ghost" className="gap-2">
                Все новые
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {recentRecipes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentRecipes.map((recipe) => (
                <PublicRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Пока нет публичных рецептов. Станьте первым, кто поделится своим рецептом!</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-12 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Популярные рецепты</h2>
            <Link href="/dashboard/public?sort=popular">
              <Button variant="ghost" className="gap-2">
                Все популярные
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {popularRecipes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularRecipes.map((recipe) => (
                <PublicRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Пока нет популярных рецептов. Лайкайте рецепты, чтобы они стали популярными!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
