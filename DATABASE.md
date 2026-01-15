## Что есть в системе (сущности):

Note - заметки
User — владелец рецептов, автор, голосующий
Recip — сам рецепт (может быть приватным или публичным)
Tag — метки (многие-ко-многим с Recip)
Vote — голос пользователя за публичный промт (уникально: один пользователь → один голос на рецепт)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) RecipVersion — версии промта (история изменений)

## Ключевые правила:

- Публичность — это свойство Recip (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, recipId) — уникальный индекс

## Схема базы данных
- Note: id, ownerId -> User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- Recip: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- Vote: id, userId -> User, recipId -> Recip, value int default 1, createdAt
- Category: id, category
- Ограничение: один пользователь может проголосовать за рецепт только один раз:
  UNIQUE(userId, recipId)
- Индексы:
  Recip(ownerId, updatedAt)
  Recip(visibility, createdAt)
  Vote(recipId)
  Vote(userId)
- onDelete: Cascade для связей
