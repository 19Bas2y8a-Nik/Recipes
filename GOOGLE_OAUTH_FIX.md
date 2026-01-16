# Решение ошибки "redirect_uri_mismatch" в Google OAuth

## Ошибка
```
Ошибка 400: redirect_uri_mismatch
Доступ заблокирован: недопустимый запрос от этого приложения
```

## Причина
Redirect URI, который отправляет ваше приложение, не совпадает с тем, что указано в Google Cloud Console.

## Решение

### Шаг 1: Определите правильный redirect URI

**Для локальной разработки:**
```
http://localhost:3000/api/auth/callback/google
```

**Для продакшена на Vercel:**
```
https://your-project.vercel.app/api/auth/callback/google
```
(Замените `your-project` на имя вашего проекта на Vercel)

**Для preview деплойментов:**
```
https://your-project-git-branch-username.vercel.app/api/auth/callback/google
```

### Шаг 2: Добавьте redirect URI в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите ваш проект
3. Перейдите в **APIs & Services** → **Credentials**
4. Найдите и откройте ваш **OAuth 2.0 Client ID**
5. В разделе **Authorized redirect URIs** нажмите **+ ADD URI**
6. Добавьте все необходимые URI:

   **Для локальной разработки:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **Для продакшена:**
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
   (Замените на ваш реальный домен)

   **Важно:** URI должны совпадать **точно**, включая:
   - Протокол (`http://` или `https://`)
   - Домен (с поддоменом, если есть)
   - Путь (`/api/auth/callback/google`)
   - Отсутствие слэша в конце

7. Нажмите **SAVE**

### Шаг 3: Проверьте текущий redirect URI

Чтобы узнать, какой URI использует ваше приложение:

**Локально:**
- Откройте консоль браузера (F12)
- Перейдите на страницу `/login`
- Нажмите "Войти через Google"
- В консоли или в URL вы увидите параметр `redirect_uri` в запросе

**На продакшене:**
- Проверьте URL вашего проекта на Vercel
- Redirect URI будет: `https://ваш-домен.vercel.app/api/auth/callback/google`

### Шаг 4: Типичные ошибки

#### ❌ Неправильно:
```
http://localhost:3000/api/auth/callback/google/  (лишний слэш в конце)
https://localhost:3000/api/auth/callback/google   (https вместо http для localhost)
http://127.0.0.1:3000/api/auth/callback/google   (IP вместо localhost)
https://your-project.vercel.app/api/auth/callback/google/  (лишний слэш)
```

#### ✅ Правильно:
```
http://localhost:3000/api/auth/callback/google
https://your-project.vercel.app/api/auth/callback/google
```

### Шаг 5: Проверка после исправления

1. **Подождите 1-2 минуты** после сохранения в Google Cloud Console
   - Изменения могут применяться с небольшой задержкой

2. **Очистите кэш браузера** или откройте в режиме инкогнито

3. **Попробуйте снова:**
   - Локально: http://localhost:3000/login
   - На продакшене: https://your-project.vercel.app/login

### Шаг 6: Если проблема сохраняется

1. **Проверьте домен на Vercel:**
   - В Vercel Dashboard → Settings → Domains
   - Убедитесь, что используете правильный домен

2. **Проверьте переменные окружения:**
   - Убедитесь, что `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET` правильные
   - Проверьте, что они добавлены для нужного окружения

3. **Проверьте логи:**
   - В Google Cloud Console → APIs & Services → OAuth consent screen
   - Проверьте, что приложение не в режиме тестирования (или добавьте ваш email в тестовые пользователи)

## Быстрая проверка

### Для локальной разработки:
1. В Google Cloud Console добавьте:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
2. Сохраните
3. Попробуйте войти снова

### Для продакшена:
1. Узнайте ваш домен на Vercel (например: `recipes-abc123.vercel.app`)
2. В Google Cloud Console добавьте:
   ```
   https://recipes-abc123.vercel.app/api/auth/callback/google
   ```
3. Сохраните
4. Передеплойте проект на Vercel
5. Попробуйте войти снова

## Дополнительная информация

### Если используете кастомный домен:
Добавьте redirect URI для кастомного домена:
```
https://yourdomain.com/api/auth/callback/google
```

### Если используете preview деплойменты:
Можно добавить wildcard (если поддерживается):
```
https://*.vercel.app/api/auth/callback/google
```

Или добавляйте каждый preview URL отдельно по мере необходимости.
