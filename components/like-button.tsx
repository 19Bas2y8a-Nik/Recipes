'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  recipeId: string
  initialLiked: boolean
  initialCount: number
  disabled?: boolean
}

export function LikeButton({ recipeId, initialLiked, initialCount, disabled }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLike = async () => {
    if (disabled || loading) return

    // Оптимистичное обновление
    const previousLiked = liked
    const previousCount = count
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка при обработке лайка')
      }

      const data = await response.json()
      setLiked(data.liked)
      setCount(data.likesCount)
      router.refresh()
    } catch (err) {
      // Откатываем оптимистичное обновление
      setLiked(previousLiked)
      setCount(previousCount)
      setError(err instanceof Error ? err.message : 'Ошибка при обработке лайка')
      console.error('Ошибка при обработке лайка:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={disabled || loading}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        <span>{count}</span>
      </Button>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {disabled && !error && (
        <p className="text-xs text-muted-foreground">Войдите, чтобы лайкнуть</p>
      )}
    </div>
  )
}
