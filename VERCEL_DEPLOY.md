# Решение проблемы "DEPLOYMENT_NOT_FOUND" на Vercel

## Быстрое решение

### 1. Проверьте проект в Vercel Dashboard

1. Зайдите на [Vercel Dashboard](https://vercel.com/dashboard)
2. Найдите ваш проект в списке
3. Если проекта нет - создайте новый:
   - Нажмите "Add New..." → "Project"
   - Импортируйте Git репозиторий
   - Настройте переменные окружения (см. ниже)

### 2. Настройте переменные окружения

В Settings → Environment Variables добавьте:

```
DATABASE_URL=your-neon-db-connection-string-with-pooler
AUTH_SECRET=your-generated-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Важно:**
- Используйте **pooler connection** для DATABASE_URL (должно быть `-pooler` в хосте)
- Добавьте переменные для всех окружений (Production, Preview, Development)
- После добавления переменных **обязательно передеплойте проект**

### 3. Примените миграции базы данных

После первого деплоя нужно создать таблицы для аутентификации:

```bash
# Через Vercel CLI
vercel env pull .env.local
pnpm exec prisma migrate deploy
```

Или через Neon Dashboard SQL Editor выполните миграции вручную.

### 4. Настройте Google OAuth Redirect URI

В Google Cloud Console добавьте в "Authorized redirect URIs":
- `https://your-project.vercel.app/api/auth/callback/google`

### 5. Передеплойте проект

1. В Vercel Dashboard → Deployments
2. Нажмите "Redeploy" на последнем деплойменте
3. Или сделайте новый commit и push в Git

## Проверка

После деплоя проверьте:
1. Главная страница открывается: `https://your-project.vercel.app`
2. Страница входа работает: `https://your-project.vercel.app/login`
3. Аутентификация через Google работает

## Частые проблемы

### "404: DEPLOYMENT_NOT_FOUND"
- Проект был удален или URL неправильный
- Решение: создайте новый деплой через Git push или Redeploy

### "Database connection error"
- Неправильный DATABASE_URL или база заморожена
- Решение: проверьте connection string, используйте pooler, разморозьте базу в Neon

### "AUTH_SECRET is missing"
- Переменная окружения не добавлена
- Решение: добавьте AUTH_SECRET в Vercel Settings → Environment Variables

### "OAuth callback error"
- Неправильный redirect URI в Google Console
- Решение: добавьте правильный URL в Google OAuth settings
