import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recipes - Рецепты',
  description: 'Приложение для управления рецептами на Next.js с Prisma и NeonDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
