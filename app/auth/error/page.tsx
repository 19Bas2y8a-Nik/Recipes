'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'Проблема с конфигурацией сервера. Проверьте переменные окружения.',
    AccessDenied: 'Доступ запрещен. Убедитесь, что ваш email добавлен в тестовые пользователи Google OAuth.',
    Verification: 'Ошибка верификации. Попробуйте войти снова.',
    Default: 'Произошла ошибка при входе. Попробуйте снова.',
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-card border rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Ошибка аутентификации</h1>
        <p className="text-muted-foreground">{errorMessage}</p>
        
        {error === 'Configuration' && (
          <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
            <p className="font-semibold">Проверьте:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Файл .env.local существует и содержит все переменные</li>
              <li>Переменные AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET установлены</li>
              <li>База данных доступна и миграции применены</li>
              <li>Откройте <Link href="/api/test-auth" className="text-primary underline">/api/test-auth</Link> для диагностики</li>
            </ul>
          </div>
        )}

        {error === 'AccessDenied' && (
          <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
            <p className="font-semibold">Решение:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Откройте Google Cloud Console</li>
              <li>Перейдите в OAuth consent screen</li>
              <li>Добавьте ваш email в раздел "Test users"</li>
              <li>Попробуйте войти снова</li>
            </ol>
          </div>
        )}

        <div className="flex gap-2">
          <Link href="/login">
            <Button>Попробовать снова</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
