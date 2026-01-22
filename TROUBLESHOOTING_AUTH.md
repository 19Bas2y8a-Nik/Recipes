# Решение проблем с аутентификацией

## Ошибка: "Server error - There is a problem with the server configuration"

Эта ошибка обычно возникает по следующим причинам:

### 1. Отсутствуют переменные окружения

Убедитесь, что создан файл `.env.local` в корне проекта со следующими переменными:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Auth.js
AUTH_SECRET="ваш-секретный-ключ-здесь"

# Google OAuth
GOOGLE_CLIENT_ID="ваш-google-client-id"
GOOGLE_CLIENT_SECRET="ваш-google-client-secret"
```

**Как сгенерировать AUTH_SECRET:**

В PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Или:
```powershell
$bytes = New-Object byte[] 32; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### 2. База данных не настроена

Убедитесь, что:
- База данных доступна
- Применены миграции Prisma:
  ```bash
  pnpm db:push
  # или
  pnpm db:migrate
  ```

### 3. Google OAuth не настроен

Проверьте:
- Google OAuth Client ID и Secret правильные
- В Google Cloud Console добавлен redirect URI: `http://localhost:3000/api/auth/callback/google` (для разработки)
- OAuth consent screen настроен

### 4. Проверка подключения к базе данных

Проверьте, что Prisma может подключиться к базе:

```bash
pnpm prisma studio
```

Если Prisma Studio не открывается, проблема в подключении к базе данных.

### 5. Перезапуск сервера разработки

После добавления переменных окружения:

1. Остановите сервер (Ctrl+C)
2. Убедитесь, что файл `.env.local` создан и содержит все переменные
3. Запустите сервер снова:
   ```bash
   pnpm dev
   ```

### 6. Проверка логов

В консоли сервера разработки должны быть видны ошибки. Обратите внимание на:
- Ошибки подключения к базе данных
- Отсутствующие переменные окружения
- Ошибки Prisma

### 7. Проверка структуры базы данных

Убедитесь, что в базе данных созданы таблицы:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`

Если таблиц нет, выполните:
```bash
pnpm db:push
```
