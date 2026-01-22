'use client'

import { RecipeDialog } from '@/components/recipe-dialog'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRecipePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      router.push('/dashboard')
    }
  }

  return (
    <RecipeDialog
      open={open}
      onOpenChange={handleOpenChange}
      recipe={null}
    />
  )
}
