'use client'

import { RecipeCard } from './recipe-card'
import { RecipeDialog } from './recipe-dialog'
import { useState } from 'react'
import { EmptyState } from './empty-state'

interface Recipe {
  id: string
  title: string
  content: string
  visibility: 'PUBLIC' | 'PRIVATE'
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  likesCount?: number
  likedByMe?: boolean
}

interface RecipesListProps {
  recipes: Recipe[]
}

export function RecipesList({ recipes }: RecipesListProps) {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (recipes.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            showLikeButton={recipe.likesCount !== undefined}
            onEdit={(recipe) => {
              setEditingRecipe(recipe)
              setIsDialogOpen(true)
            }}
          />
        ))}
      </div>
      <RecipeDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingRecipe(null)
          }
        }}
        recipe={editingRecipe}
      />
    </>
  )
}
