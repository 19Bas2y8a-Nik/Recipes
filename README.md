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
3. Добавьте переменную окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: ваша строка подключения к NeonDB
4. В настройках Build Command убедитесь, что используется:
   ```
   pnpm run build
   ```
   (Prisma Client будет сгенерирован автоматически)
   
   **Важно:** Vercel автоматически определит pnpm, если в проекте есть `packageManager` в `package.json` или `pnpm-lock.yaml`
5. Нажмите Deploy

### 3. Post-deploy скрипт (опционально)

После первого деплоя, если нужно выполнить миграции или seed:

1. В Vercel Dashboard перейдите в Settings → Functions
2. Добавьте Post-deploy hook или используйте Vercel CLI:

```bash
vercel env pull .env.local
pnpm exec prisma migrate deploy
pnpm exec prisma db seed
```

Или выполните миграции через Neon Dashboard SQL Editor.

## Проверка работы

После деплоя откройте ваш сайт на Vercel. Главная страница должна отображать список заметок из базы данных PostgreSQL (Neon).

Если заметок нет, выполните seed через Neon Dashboard SQL Editor или через Vercel CLI.

## Troubleshooting

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
