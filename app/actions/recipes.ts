'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const recipeSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
  content: z.string().min(1, 'Содержание обязательно'),
  isPublic: z.boolean().optional().default(false),
})

export async function createRecipe(formData: FormData) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Необходима авторизация' }
    }

    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      isPublic: formData.get('isPublic') === 'true' || formData.get('isPublic') === 'on',
    }

    const validated = recipeSchema.parse(data)

    const recipe = await prisma.recip.create({
      data: {
        title: validated.title,
        content: validated.content,
        visibility: validated.isPublic ? 'PUBLIC' : 'PRIVATE',
        isFavorite: false,
        ownerId: userId,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, recipe }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Ошибка при создании рецепта:', error)
    return { error: 'Ошибка при создании рецепта' }
  }
}

export async function updateRecipe(id: string, formData: FormData) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Необходима авторизация' }
    }

    // Проверяем, что рецепт принадлежит пользователю
    const existing = await prisma.recip.findFirst({
      where: { id, ownerId: userId },
    })

    if (!existing) {
      return { error: 'Рецепт не найден или нет доступа' }
    }

    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      isPublic: formData.get('isPublic') === 'true' || formData.get('isPublic') === 'on',
    }

    const validated = recipeSchema.parse(data)

    const recipe = await prisma.recip.update({
      where: { id },
      data: {
        title: validated.title,
        content: validated.content,
        visibility: validated.isPublic ? 'PUBLIC' : 'PRIVATE',
      },
    })

    revalidatePath('/dashboard')
    return { success: true, recipe }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('Ошибка при обновлении рецепта:', error)
    return { error: 'Ошибка при обновлении рецепта' }
  }
}

export async function deleteRecipe(id: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Необходима авторизация' }
    }

    // Проверяем, что рецепт принадлежит пользователю
    const existing = await prisma.recip.findFirst({
      where: { id, ownerId: userId },
    })

    if (!existing) {
      return { error: 'Рецепт не найден или нет доступа' }
    }

    await prisma.recip.delete({
      where: { id },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Ошибка при удалении рецепта:', error)
    return { error: 'Ошибка при удалении рецепта' }
  }
}

export async function togglePublic(id: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Необходима авторизация' }
    }

    const existing = await prisma.recip.findFirst({
      where: { id, ownerId: userId },
    })

    if (!existing) {
      return { error: 'Рецепт не найден или нет доступа' }
    }

    const recipe = await prisma.recip.update({
      where: { id },
      data: {
        visibility: existing.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
      },
    })

    revalidatePath('/dashboard')
    return { success: true, recipe }
  } catch (error) {
    console.error('Ошибка при изменении видимости:', error)
    return { error: 'Ошибка при изменении видимости' }
  }
}

export async function toggleFavorite(id: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Необходима авторизация' }
    }

    const existing = await prisma.recip.findFirst({
      where: { id, ownerId: userId },
    })

    if (!existing) {
      return { error: 'Рецепт не найден или нет доступа' }
    }

    const recipe = await prisma.recip.update({
      where: { id },
      data: {
        isFavorite: !existing.isFavorite,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, recipe }
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error)
    return { error: 'Ошибка при изменении избранного' }
  }
}
