import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Создаём тестового пользователя для заметок
  const testUser = await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    update: {},
    create: {
      email: 'seed@example.com',
      name: 'Seed User',
    },
  })

  const note1 = await prisma.note.create({
    data: {
      title: 'Первая заметка',
      ownerId: testUser.id,
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'Вторая заметка',
      ownerId: testUser.id,
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Третья заметка',
      ownerId: testUser.id,
    },
  })

  console.log('Created notes:', { note1, note2, note3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
