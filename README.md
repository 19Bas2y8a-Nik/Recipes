# Next.js + Prisma + NeonDB

Минимальный рабочий проект на Next.js (App Router) с Prisma и NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Технологии

- **Next.js 14** (App Router, TypeScript)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (деплой)

## Быстрый старт

### 0. Установка pnpm (если еще не установлен)

```bash
npm install -g pnpm
```

Или через другие методы: https://pnpm.io/installation

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка базы данных

1. Создайте проект в [Neon Dashboard](https://console.neon.tech)
2. Скопируйте строку подключения (Connection String)
3. Создайте файл `.env` в корне проекта:

```bash
cp .env.example .env
```

4. Вставьте строку подключения в `.env`:

```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 3. Настройка Prisma

Создайте миграцию и примените схему:

```bash
pnpm run db:push
```

Или создайте миграцию:

```bash
pnpm run db:migrate
```

### 4. Заполнение базы данных (seed)

```bash
pnpm run db:seed
```

### 5. Запуск проекта

```bash
pnpm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
.
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница (читает данные из БД)
│   └── globals.css     # Глобальные стили
├── lib/
│   └── prisma.ts       # Prisma Client (singleton)
├── prisma/
│   ├── schema.prisma   # Схема базы данных
│   └── seed.ts         # Seed скрипт
├── .env.example        # Пример переменных окружения
├── next.config.js      # Конфигурация Next.js
├── package.json        # Зависимости и скрипты
└── tsconfig.json       # Конфигурация TypeScript
```

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Команды

```bash
# Разработка
pnpm run dev              # Запуск dev сервера

# База данных
pnpm run db:push          # Применить схему к БД (без миграции)
pnpm run db:migrate       # Создать и применить миграцию
pnpm run db:seed          # Заполнить БД тестовыми данными
pnpm run db:studio        # Открыть Prisma Studio

# Сборка и деплой
pnpm run build            # Собрать проект
pnpm run start            # Запустить production сервер
```

## Деплой на Vercel

### 1. Подготовка

1. Убедитесь, что проект работает локально
2. Закоммитьте изменения в Git

### 2. Деплой

1. Зайдите на [Vercel](https://vercel.com)
2. Импортируйте ваш Git репозиторий
3. Добавьте переменные окружения в Settings → Environment Variables:
   - **DATABASE_URL**: ваша строка подключения к NeonDB (с `-pooler` для serverless)
   - **AUTH_SECRET**: сгенерированный секретный ключ (см. `ENV.md`)
   - **GOOGLE_CLIENT_ID**: ваш Google OAuth Client ID
   - **GOOGLE_CLIENT_SECRET**: ваш Google OAuth Client Secret
   
   **Важно:** Добавьте эти переменные для всех окружений (Production, Preview, Development)
   
4. В настройках Build Command убедитесь, что используется:
   ```
   pnpm run build
   ```
   (Prisma Client будет сгенерирован автоматически)
   
   **Важно:** Vercel автоматически определит pnpm, если в проекте есть `packageManager` в `package.json` или `pnpm-lock.yaml`
   
5. В разделе "Authorized redirect URIs" вашего Google OAuth приложения добавьте:
   - `https://your-project.vercel.app/api/auth/callback/google` (замените на ваш домен)
   
6. Нажмите Deploy

### 3. Применение миграций базы данных

После первого деплоя необходимо применить миграции для создания таблиц Auth.js (users, accounts, sessions, verification_tokens):

**Вариант 1: Через Vercel CLI (рекомендуется)**
```bash
# Установите Vercel CLI, если еще не установлен
npm i -g vercel

# Войдите в Vercel
vercel login

# Подключите проект
vercel link

# Примените миграции
vercel env pull .env.local
pnpm exec prisma migrate deploy
```

**Вариант 2: Через Neon Dashboard**
1. Откройте [Neon Dashboard](https://console.neon.tech)
2. Перейдите в SQL Editor
3. Выполните миграции вручную или используйте команду:
   ```bash
   pnpm exec prisma migrate deploy
   ```

**Вариант 3: Локально перед деплоем**
```bash
# Примените миграции локально
pnpm run db:migrate

# Или используйте db:push (для разработки)
pnpm run db:push
```

**Важно:** После добавления аутентификации обязательно примените миграции, чтобы создать таблицы `accounts`, `sessions` и `verification_tokens` в базе данных.

## Проверка работы

После деплоя откройте ваш сайт на Vercel. Главная страница должна отображать список заметок из базы данных PostgreSQL (Neon).

Если заметок нет, выполните seed через Neon Dashboard SQL Editor или через Vercel CLI.

## Troubleshooting

### Ошибка "DEPLOYMENT_NOT_FOUND" (404)

Если вы видите ошибку `404: NOT_FOUND Code: DEPLOYMENT_NOT_FOUND`:

1. **Проверьте URL деплоймента:**
   - Убедитесь, что вы используете правильный URL проекта
   - Проверьте, что проект не был удален в Vercel Dashboard

2. **Передеплойте проект:**
   - Зайдите в Vercel Dashboard → ваш проект
   - Перейдите в раздел "Deployments"
   - Нажмите "Redeploy" на последнем деплойменте
   - Или создайте новый деплой через Git push

3. **Проверьте настройки проекта:**
   - Settings → General → убедитесь, что проект подключен к правильному Git репозиторию
   - Settings → Git → проверьте, что ветка настроена правильно

4. **Проверьте переменные окружения:**
   - Settings → Environment Variables
   - Убедитесь, что все необходимые переменные добавлены (DATABASE_URL, AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
   - После добавления переменных нужно передеплоить проект

### Ошибка подключения к БД

- Проверьте, что `DATABASE_URL` правильно настроен в Vercel
- Убедитесь, что используется `?sslmode=require` в строке подключения
- Проверьте, что IP адреса Vercel разрешены в Neon (обычно разрешены по умолчанию)

### Ошибка "Connection Closed" на Vercel

Если вы видите ошибку `Error { kind: Closed, cause: None }`:

1. **Используйте Pooler Connection для Vercel:**
   - В строке подключения должен быть `-pooler` в хосте
   - Пример: `postgresql://user:pass@ep-xxx-xxx-pooler.region.aws.neon.tech/db?sslmode=require`
   - Pooler connection необходим для serverless окружений (Vercel)

2. **Проверьте, что база данных активна:**
   - Откройте Neon Dashboard
   - Убедитесь, что статус базы данных "Active" (не "Paused")
   - Если база заморожена, нажмите "Resume" или "Wake up"

3. **Проверьте переменную окружения в Vercel:**
   - Settings → Environment Variables
   - Убедитесь, что `DATABASE_URL` содержит pooler connection string
   - После изменения переменной окружения нужно передеплоить проект

### Prisma Client не найден

- Убедитесь, что в `package.json` есть скрипт `build` с `prisma generate`
- Проверьте, что Prisma установлен: `pnpm install`

### Миграции не применены

- Выполните `pnpm run db:push` или `pnpm run db:migrate` локально
- Или примените миграции через Neon Dashboard

## Лицензия

MIT
