'use client'

import { BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Нет рецептов</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Начните создавать рецепты, чтобы они появились здесь
      </p>
      <Link href="/dashboard/create">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Создать первый рецепт
        </Button>
      </Link>
    </div>
  )
}
