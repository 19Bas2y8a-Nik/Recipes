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

**Как добавить переменные:**
1. В Vercel Dashboard откройте ваш проект
2. Перейдите в **Settings** (в верхнем меню)
3. Выберите **Environment Variables** (в левом меню)
4. Нажмите **Add New** или **Add** для добавления новой переменной

**Как проверить, что переменные добавлены для всех окружений:**

После добавления переменной вы увидите таблицу со всеми переменными. Для каждой переменной есть колонки с чекбоксами:
- ✅ **Production** - для production деплойментов
- ✅ **Preview** - для preview деплойментов (pull requests, branches)
- ✅ **Development** - для локальной разработки через `vercel dev`

**Проверка:**
1. Найдите каждую переменную в списке:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
2. Убедитесь, что для каждой переменной отмечены все три чекбокса:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development

**Если чекбоксы не отмечены:**
1. Нажмите на переменную (или кнопку редактирования)
2. В открывшемся окне отметьте нужные окружения
3. Нажмите **Save**

**Важно:**
- Используйте **pooler connection** для DATABASE_URL (должно быть `-pooler` в хосте)
- После добавления/изменения переменных **обязательно передеплойте проект**
- Переменные применяются только к новым деплойментам

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

### "Build Failed - Command exited with 1"

**Причины и решения:**

1. **Отсутствуют переменные окружения:**
   - Убедитесь, что все переменные добавлены в Vercel:
     - `DATABASE_URL`
     - `AUTH_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
   - Добавьте для всех окружений (Production, Preview, Development)

2. **Ошибка Prisma generate:**
   - Проверьте, что `prisma/schema.prisma` корректный
   - Убедитесь, что `postinstall` скрипт в `package.json` содержит `prisma generate`
   - Проверьте логи сборки в Vercel для деталей ошибки

3. **Ошибки TypeScript:**
   - Запустите локально: `pnpm run build`
   - Исправьте все ошибки TypeScript перед деплоем
   - Проверьте файл `tsconfig.json`

4. **Проблемы с зависимостями:**
   - Убедитесь, что `pnpm-lock.yaml` закоммичен
   - Проверьте, что `packageManager` указан в `package.json`

**Проверка перед деплоем:**

**Для Windows (PowerShell):**
```powershell
# Локально проверьте сборку
pnpm install
pnpm run build

# Если сборка успешна локально, но падает на Vercel:
# 1. Проверьте переменные окружения в Vercel
# 2. Проверьте логи сборки в Vercel Dashboard
# 3. Убедитесь, что все файлы закоммичены
```

**Для Linux/Mac (Bash):**
```bash
# Локально проверьте сборку
pnpm install
pnpm run build

# Если сборка успешна локально, но падает на Vercel:
# 1. Проверьте переменные окружения в Vercel
# 2. Проверьте логи сборки в Vercel Dashboard
# 3. Убедитесь, что все файлы закоммичены
```

### "404: DEPLOYMENT_NOT_FOUND"
- Проект был удален или URL неправильный
- Решение: создайте новый деплой через Git push или Redeploy

### "Database connection error"
- Неправильный DATABASE_URL или база заморожена
- Решение: проверьте connection string, используйте pooler, разморозьте базу в Neon

### "AUTH_SECRET is not set"
- Переменная окружения не добавлена
- Решение: добавьте AUTH_SECRET в Vercel Settings → Environment Variables
- После добавления передеплойте проект

### "OAuth callback error"
- Неправильный redirect URI в Google Console
- Решение: добавьте правильный URL в Google OAuth settings
