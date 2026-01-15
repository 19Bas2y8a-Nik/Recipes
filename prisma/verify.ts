import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Начинаем проверку базы данных...\n')

  try {
    // 1. Создаём тестового пользователя
    console.log('1️⃣ Создаём тестового пользователя...')
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Тестовый Пользователь',
      },
    })
    console.log('✅ Пользователь создан:', { id: user.id, email: user.email, name: user.name })
    console.log()

    // 2. Создаём тестовый промт (Recip)
    console.log('2️⃣ Создаём тестовый промт...')
    const recip = await prisma.recip.create({
      data: {
        ownerId: user.id,
        title: 'Тестовый промт для проверки',
        content: 'Это содержимое тестового промта. Оно используется для проверки работы базы данных.',
        description: 'Описание тестового промта',
        visibility: 'PUBLIC',
        publishedAt: new Date(),
      },
    })
    console.log('✅ Промт создан:', { id: recip.id, title: recip.title, visibility: recip.visibility })
    console.log()

    // 3. Создаём голос (Vote) за промт
    console.log('3️⃣ Создаём голос за промт...')
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        recipId: recip.id,
        value: 1,
      },
    })
    console.log('✅ Голос создан:', { id: vote.id, userId: vote.userId, recipId: vote.recipId, value: vote.value })
    console.log()

    // 4. Проверяем связи
    console.log('4️⃣ Проверяем связи...')
    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        recips: true,
        votes: true,
      },
    })

    console.log('✅ Связи проверены:')
    console.log(`   - У пользователя ${userWithRelations?.recips.length} промт(ов)`)
    console.log(`   - У пользователя ${userWithRelations?.votes.length} голос(ов)`)
    console.log()

    console.log('🎉 Проверка завершена успешно!')
    console.log('\nСозданные данные:')
    console.log(`   Пользователь: ${user.email} (${user.id})`)
    console.log(`   Промт: ${recip.title} (${recip.id})`)
    console.log(`   Голос: ${vote.id}`)

  } catch (error) {
    console.error('❌ Ошибка при проверке:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
