'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function CreateRecipeButton() {
  return (
    <Link href="/dashboard/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Создать рецепт
      </Button>
    </Link>
  )
}
