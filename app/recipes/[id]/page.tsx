import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LikeButton } from '@/components/like-button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function getRecipe(id: string, userId?: string) {
  const recipe = await prisma.recip.findFirst({
    where: {
      id,
      visibility: 'PUBLIC',
    },
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

  if (!recipe) {
    return null
  }

  return {
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
  }
}

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  const userId = await getCurrentUserId()
  const recipe = await getRecipe(params.id, userId)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад на главную
        </Button>
      </Link>
      
      <div className="bg-card rounded-lg border p-8">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <span>
            {recipe.owner?.name || recipe.owner?.email || 'Неизвестный автор'}
          </span>
          <span>•</span>
          <span>
            {new Date(recipe.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        
        <div className="prose max-w-none mb-6">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {recipe.content}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          {recipe.likesCount !== undefined ? (
            <LikeButton
              recipeId={recipe.id}
              initialLiked={recipe.likedByMe ?? false}
              initialCount={recipe.likesCount ?? 0}
              disabled={recipe.likedByMe === undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
