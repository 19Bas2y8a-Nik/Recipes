# Решение проблем со сборкой на Vercel

## Ошибка: "Build Failed - Command exited with 1"

### Шаг 1: Проверьте логи сборки

В Vercel Dashboard:
1. Перейдите в ваш проект
2. Откройте вкладку "Deployments"
3. Нажмите на последний деплоймент
4. Просмотрите логи сборки (Build Logs)
5. Найдите конкретную ошибку

### Шаг 2: Проверьте переменные окружения

Убедитесь, что в Vercel Settings → Environment Variables добавлены:

```
DATABASE_URL=postgresql://... (с -pooler)
AUTH_SECRET=ваш-секретный-ключ
GOOGLE_CLIENT_ID=ваш-client-id
GOOGLE_CLIENT_SECRET=ваш-client-secret
```

**Важно:** Добавьте для Production, Preview и Development.

### Шаг 3: Проверьте сборку локально

**Для Windows (PowerShell):**
```powershell
# Очистите кэш
Remove-Item -Recurse -Force .next, node_modules -ErrorAction SilentlyContinue

# Установите зависимости
pnpm install

# Попробуйте собрать
pnpm run build
```

**Для Linux/Mac (Bash):**
```bash
# Очистите кэш
rm -rf .next node_modules

# Установите зависимости
pnpm install

# Попробуйте собрать
pnpm run build
```

Если сборка падает локально - исправьте ошибки перед деплоем.

### Шаг 4: Типичные ошибки и решения

#### Ошибка: "AUTH_SECRET is not set"
**Решение:** Добавьте переменную `AUTH_SECRET` в Vercel Environment Variables

#### Ошибка: "Prisma Client not generated"
**Решение:** 
- Убедитесь, что в `package.json` есть скрипт `postinstall: "prisma generate"`
- Проверьте, что `prisma/schema.prisma` корректен

#### Ошибка: "Module not found"
**Решение:**
- Проверьте, что все зависимости в `package.json`
- Убедитесь, что `pnpm-lock.yaml` закоммичен
- Проверьте импорты в файлах

#### Ошибка: "Type error"
**Решение:**
- Запустите `pnpm run build` локально
- Исправьте все ошибки TypeScript
- Проверьте `tsconfig.json`

#### Ошибка: "Cannot find module '@/...'"
**Решение:**
- Проверьте `tsconfig.json` - должно быть `"paths": { "@/*": ["./*"] }`
- Убедитесь, что файлы существуют по указанным путям

### Шаг 5: Проверьте конфигурацию

**next.config.js:**
```js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // В production лучше false
  },
  eslint: {
    ignoreDuringBuilds: false, // В production лучше false
  },
}
```

**package.json:**
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### Шаг 6: Очистка и пересборка

Если ничего не помогает:

1. В Vercel Dashboard → Settings → General
2. Нажмите "Clear Build Cache"
3. Передеплойте проект

Или через CLI:
```bash
vercel --force
```

## Проверка перед каждым деплоем

**Для Windows (PowerShell):**
```powershell
# 1. Проверка типов
pnpm run build

# 2. Проверка линтера (если настроен)
pnpm run lint

# 3. Проверка переменных окружения
# Убедитесь, что все переменные есть в .env.local
Get-Content .env.local
```

**Для Linux/Mac (Bash):**
```bash
# 1. Проверка типов
pnpm run build

# 2. Проверка линтера (если настроен)
pnpm run lint

# 3. Проверка переменных окружения
# Убедитесь, что все переменные есть в .env.local
cat .env.local
```

## Получение детальных логов

Если ошибка неочевидна, включите детальные логи:

В Vercel Dashboard → Settings → General → Build & Development Settings:
- Установите "Debug Logs" в ON

Это покажет более подробную информацию об ошибках сборки.
