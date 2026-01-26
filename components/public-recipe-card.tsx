'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, ArrowRight } from 'lucide-react'
import { LikeButton } from './like-button'
import Link from 'next/link'

interface PublicRecipeCardProps {
  recipe: {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    likesCount?: number
    likedByMe?: boolean
    owner?: {
      name: string | null
      email: string
    } | null
  }
}

export function PublicRecipeCard({ recipe }: PublicRecipeCardProps) {
  const preview = recipe.content.length > 150 
    ? recipe.content.substring(0, 150) + '...' 
    : recipe.content

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>
                {recipe.owner?.name || recipe.owner?.email || 'Неизвестный автор'}
              </span>
              <span>•</span>
              <span>
                {new Date(recipe.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {preview}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {recipe.likesCount !== undefined ? (
          <LikeButton
            recipeId={recipe.id}
            initialLiked={recipe.likedByMe ?? false}
            initialCount={recipe.likesCount ?? 0}
            disabled={recipe.likedByMe === undefined}
          />
        ) : null}
        <Link href={`/recipes/${recipe.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            Открыть
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
