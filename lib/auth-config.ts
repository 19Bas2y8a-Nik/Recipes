import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

function getAuthConfig() {
  // Проверяем переменные окружения
  const authSecret = process.env.AUTH_SECRET
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  const missingVars: string[] = []
  if (!authSecret) missingVars.push('AUTH_SECRET')
  if (!googleClientId) missingVars.push('GOOGLE_CLIENT_ID')
  if (!googleClientSecret) missingVars.push('GOOGLE_CLIENT_SECRET')

  if (missingVars.length > 0) {
    const errorMessage = `Отсутствуют переменные окружения: ${missingVars.join(', ')}. Создайте файл .env.local и добавьте эти переменные.`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  try {
    const config = NextAuth({
      adapter: PrismaAdapter(prisma),
      secret: authSecret,
      trustHost: true, // Для Next.js 14 и Vercel - позволяет NextAuth автоматически определять URL
      providers: [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ],
      pages: {
        signIn: '/login',
        error: '/auth/error',
      },
      callbacks: {
        async session({ session, user, token }) {
          // В NextAuth v5 с PrismaAdapter, user доступен при использовании database sessions
          if (session.user) {
            if (user) {
              session.user.id = user.id
            } else if (token?.sub) {
              // Fallback на token, если user недоступен
              session.user.id = token.sub
            }
          }
          return session
        },
        async jwt({ token, user }) {
          // Сохраняем user.id в token для использования в session callback
          if (user) {
            token.sub = user.id
          }
          return token
        },
      },
      debug: process.env.NODE_ENV === 'development',
    })
    
    return config
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при инициализации NextAuth'
    console.error('Ошибка при инициализации NextAuth:', errorMessage, error)
    throw new Error(`Ошибка конфигурации NextAuth: ${errorMessage}`)
  }
}

export const { handlers, signIn, signOut, auth } = getAuthConfig()
