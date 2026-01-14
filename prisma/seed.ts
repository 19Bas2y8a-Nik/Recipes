import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const note1 = await prisma.note.create({
    data: {
      title: 'Первая заметка',
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'Вторая заметка',
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Третья заметка',
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
