'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Star, Globe, Lock, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { toggleFavorite, togglePublic, deleteRecipe } from '@/app/actions/recipes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    content: string
    visibility: 'PUBLIC' | 'PRIVATE'
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
  }
  onEdit: (recipe: any) => void
}

export function RecipeCard({ recipe, onEdit }: RecipeCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const preview = recipe.content.length > 150 
    ? recipe.content.substring(0, 150) + '...' 
    : recipe.content

  const handleToggleFavorite = async () => {
    await toggleFavorite(recipe.id)
    router.refresh()
  }

  const handleTogglePublic = async () => {
    await togglePublic(recipe.id)
    router.refresh()
  }

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      setIsDeleting(true)
      await deleteRecipe(recipe.id)
      router.refresh()
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {recipe.visibility === 'PUBLIC' ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>
                {new Date(recipe.updatedAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(recipe)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePublic}>
                {recipe.visibility === 'PUBLIC' ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Сделать приватным
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Опубликовать
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {preview}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={recipe.isFavorite ? "default" : "outline"}
          size="sm"
          onClick={handleToggleFavorite}
        >
          <Star className={`h-4 w-4 mr-2 ${recipe.isFavorite ? 'fill-current' : ''}`} />
          {recipe.isFavorite ? 'В избранном' : 'В избранное'}
        </Button>
      </CardFooter>
    </Card>
  )
}
