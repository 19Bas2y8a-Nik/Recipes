# Переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recipes?schema=public"

# Auth.js
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Как получить значения:

1. **AUTH_SECRET**: Сгенерируйте случайную строку:
   
   **Для Windows (PowerShell):**
   ```powershell
   $bytes = New-Object byte[] 32; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)
   ```
   
   Или более простой способ (менее криптографически стойкий, но достаточный):
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   **Для Linux/Mac (Bash):**
   ```bash
   openssl rand -base64 32
   ```
   
   **Альтернатива (Node.js):**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET**:
   
   **Шаг 1: Создайте проект**
   - Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
   - Нажмите на выпадающий список проектов вверху страницы
   - Нажмите "Новый проект" (New Project)
   - Введите название проекта (например, "Recipes App")
   - Нажмите "Создать" (Create)
   
   **Шаг 2: Настройте OAuth consent screen**
   - В меню слева выберите "APIs & Services" → "OAuth consent screen"
   - Выберите "External" (для тестирования) или "Internal" (для Google Workspace)
   - Заполните обязательные поля:
     - App name: название вашего приложения
     - User support email: ваш email
     - Developer contact information: ваш email
   - Нажмите "Save and Continue"
   - На экране "Scopes" нажмите "Save and Continue" (можно пропустить)
   - На экране "Test users" добавьте свой email для тестирования, затем "Save and Continue"
   - На экране "Summary" нажмите "Back to Dashboard"
   
   **Шаг 3: Создайте OAuth 2.0 Client ID**
   - В меню слева выберите "APIs & Services" → "Credentials"
   - Нажмите "Create Credentials" → "OAuth client ID"
   - Выберите "Web application" в качестве типа приложения
   - Введите название (например, "Recipes Web Client")
   - В разделе "Authorized redirect URIs" добавьте:
     - `http://localhost:3000/api/auth/callback/google` (для разработки)
     - `https://yourdomain.com/api/auth/callback/google` (для продакшена, замените на ваш домен)
   - Нажмите "Create"
   - Скопируйте **Client ID** и **Client Secret** - они понадобятся для `.env.local`
   
   **Примечание**: Google+ API был отключен в 2019 году. Для OAuth аутентификации через Google больше не нужно включать какие-либо дополнительные API - достаточно настроить OAuth consent screen и создать OAuth 2.0 Client ID.
