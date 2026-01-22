import { getCurrentUser } from '@/lib/auth'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">Настройки</h1>
          <p className="text-muted-foreground mt-1">
            Управление настройками аккаунта
          </p>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-6">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Профиль</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {user?.email || 'Не указан'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Имя:</strong> {user?.name || 'Не указано'}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Настройки</h2>
              <p className="text-sm text-muted-foreground">
                Дополнительные настройки будут доступны позже
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
