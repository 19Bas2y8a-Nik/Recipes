'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createRecipe, updateRecipe } from '@/app/actions/recipes'
import { useRouter } from 'next/navigation'

interface RecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipe?: {
    id: string
    title: string
    content: string
    visibility: 'PUBLIC' | 'PRIVATE'
  } | null
}

export function RecipeDialog({ open, onOpenChange, recipe }: RecipeDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: false,
  })

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        content: recipe.content,
        isPublic: recipe.visibility === 'PUBLIC',
      })
    } else {
      setFormData({
        title: '',
        content: '',
        isPublic: false,
      })
    }
    setError(null)
  }, [recipe, open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('title', formData.title)
    formDataObj.append('content', formData.content)
    formDataObj.append('isPublic', formData.isPublic.toString())

    try {
      let result
      if (recipe) {
        result = await updateRecipe(recipe.id, formDataObj)
      } else {
        result = await createRecipe(formDataObj)
      }

      if (result.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
        router.refresh()
      }
    } catch (err) {
      setError('Произошла ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {recipe ? 'Редактировать рецепт' : 'Создать рецепт'}
            </DialogTitle>
            <DialogDescription>
              {recipe ? 'Внесите изменения в рецепт' : 'Заполните форму для создания нового рецепта'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите название рецепта"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Содержание</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Опишите рецепт..."
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublic" className="text-sm font-normal cursor-pointer">
                Опубликовать (сделать публичным)
              </Label>
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : recipe ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
