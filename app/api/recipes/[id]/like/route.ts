import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const recipeId = params.id

    // Проверяем, что рецепт существует и публичный
    const recipe = await prisma.recip.findFirst({
      where: {
        id: recipeId,
        visibility: 'PUBLIC',
      },
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Рецепт не найден или не является публичным' },
        { status: 404 }
      )
    }

    // Проверяем, есть ли уже лайк
    const existingLike = await prisma.recipeLike.findFirst({
      where: {
        userId,
        recipeId,
      },
    })

    if (existingLike) {
      // Удаляем лайк
      await prisma.recipeLike.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      // Создаем лайк
      await prisma.recipeLike.create({
        data: {
          userId,
          recipeId,
        },
      })
    }

    // Получаем актуальное количество лайков
    const likesCount = await prisma.recipeLike.count({
      where: { recipeId },
    })

    // Проверяем, лайкнул ли текущий пользователь
    const liked = !existingLike

    return NextResponse.json({
      liked,
      likesCount,
    })
  } catch (error) {
    console.error('Ошибка при обработке лайка:', error)
    return NextResponse.json(
      {
        error: 'Ошибка при обработке лайка',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    )
  }
}
