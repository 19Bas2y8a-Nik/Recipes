import { NextRequest } from 'next/server'

// Импортируем handlers с обработкой ошибок
let handlers: { GET: (req: NextRequest) => Promise<Response>, POST: (req: NextRequest) => Promise<Response> } | null = null
let importError: Error | null = null

try {
  const authConfig = require('@/lib/auth-config')
  handlers = authConfig.handlers
} catch (error) {
  importError = error instanceof Error ? error : new Error('Неизвестная ошибка при импорте auth-config')
  console.error('Ошибка при импорте auth-config:', importError)
}

// Обертываем handlers для лучшей обработки ошибок
export async function GET(request: NextRequest) {
  try {
    if (importError) {
      throw new Error(`Ошибка конфигурации: ${importError.message}. Проверьте переменные окружения и подключение к базе данных.`)
    }
    if (!handlers) {
      throw new Error('Handlers не инициализированы. Проверьте конфигурацию аутентификации.')
    }
    return await handlers.GET(request)
  } catch (error) {
    console.error('Ошибка в GET handler NextAuth:', error)
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    return new Response(
      JSON.stringify({ 
        error: 'Ошибка сервера аутентификации',
        message: errorMessage,
        hint: 'Проверьте переменные окружения и подключение к базе данных. Откройте /api/test-auth для диагностики.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (importError) {
      throw new Error(`Ошибка конфигурации: ${importError.message}. Проверьте переменные окружения и подключение к базе данных.`)
    }
    if (!handlers) {
      throw new Error('Handlers не инициализированы. Проверьте конфигурацию аутентификации.')
    }
    return await handlers.POST(request)
  } catch (error) {
    console.error('Ошибка в POST handler NextAuth:', error)
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    return new Response(
      JSON.stringify({ 
        error: 'Ошибка сервера аутентификации',
        message: errorMessage,
        hint: 'Проверьте переменные окружения и подключение к базе данных. Откройте /api/test-auth для диагностики.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
