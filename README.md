# Music Platform

Веб-приложение музыкальной платформы с регистрацией и авторизацией пользователей, библиотекой и магазином, а также административной панелью для мониторинга пользовательской активности и событий безопасности.

Проект реализован как клиент-серверное приложение на **React + TypeScript** и **Node.js + Express**. Для хранения данных используется **SQLite**, работа с базой данных выполняется через **Prisma ORM**.

## Основные возможности

### Пользовательская часть

- регистрация пользователя;
- вход и выход из аккаунта;
- JWT-аутентификация;
- защищённые маршруты;
- просмотр главной страницы и библиотеки;
- просмотр магазина;
- добавление товаров в корзину;
- автоматическая оценка уровня риска пользователя;
- предупреждение или блокировка отдельных действий при повышенном уровне риска.

### Система безопасности

- хеширование паролей с помощью `bcryptjs`;
- JWT-токены с ограниченным сроком действия;
- middleware для проверки авторизации;
- отдельное middleware для проверки роли администратора;
- журналирование пользовательских и security-событий;
- расчёт и изменение `riskScore`;
- уровни риска: `low`, `medium`, `high`;
- правило дополнительного повышения риска после трёх неудачных попыток входа;
- динамическое ограничение отдельных действий пользователя.

### Административная панель

Администратор получает доступ к:

- списку пользователей;
- текущему `riskScore` пользователей;
- журналу событий;
- статистике безопасности;
- распределению пользователей по уровням риска;
- количеству заблокированных действий;
- детальной информации о пользователе;
- истории событий пользователя;
- экспорту событий в CSV.

## Технологический стек

### Frontend

- React 19
- TypeScript
- React Router
- SCSS Modules
- React Icons
- Create React App

### Backend

- Node.js
- Express
- TypeScript
- JWT (`jsonwebtoken`)
- bcryptjs
- CORS
- dotenv

### База данных

- SQLite
- Prisma ORM

## Структура проекта

```text
music-platform/
├── src/
│   ├── components/
│   │   ├── AdminRoute/
│   │   ├── Card/
│   │   ├── Header/
│   │   ├── Input/
│   │   ├── ProductCard/
│   │   └── ProtectedRoute/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   ├── musicData.ts
│   │   ├── products.json
│   │   └── tracks.json
│   ├── hooks/
│   │   └── useAudioPlayer.ts
│   ├── pages/
│   │   ├── AdminDashboard/
│   │   ├── Home/
│   │   ├── Library/
│   │   ├── Register/
│   │   ├── SignIn/
│   │   ├── Store/
│   │   └── UserDetails/
│   ├── App.tsx
│   └── index.tsx
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── dev.db
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── event.controller.ts
│   │   ├── middleware/
│   │   │   ├── admin.middleware.ts
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── event.routes.ts
│   │   ├── services/
│   │   │   ├── admin.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── event.service.ts
│   │   │   └── risk.service.ts
│   │   ├── prisma/
│   │   ├── types/
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── index.ts
│   ├── .env
│   └── package.json
│
├── package.json
└── tsconfig.json
```

## Модель данных

В базе данных используются основные сущности:

- `User` — пользователь, его роль и текущий показатель риска;
- `Event` — событие пользовательской активности или безопасности;
- `Track` — музыкальный трек;
- `Review` — отзыв пользователя на трек.

Связи:

```text
User 1 ───── N Event
User 1 ───── N Review
Track 1 ──── N Review
```

## Система оценки риска

Для пользователя хранится показатель `riskScore` в диапазоне от `0` до `100`.

Уровни риска:

| Risk score | Уровень |
|---:|---|
| 0–29 | Low |
| 30–69 | Medium |
| 70–100 | High |

Основные изменения показателя:

| Событие | Изменение |
|---|---:|
| `login_success` | −5 |
| `login_failed` | +10 |
| `cart_add_warning` | +5 |
| `cart_add_blocked` | +10 |
| 3 неудачных входа


Значение `riskScore` ограничивается диапазоном от `0` до `100`.

При высоком уровне риска вход пользователя блокируется. В магазине также применяется динамический контроль доступа:

- **Low** — действие разрешено;
- **Medium** — действие разрешено с предупреждением;
- **High** — действие блокируется.

## API

### Аутентификация

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Административные запросы

```text
GET /api/admin/users
GET /api/admin/events
GET /api/admin/stats
GET /api/admin/users/:id
```

Доступ к административным маршрутам разрешён только авторизованным пользователям с ролью `admin`.

### События

```text
POST /api/events
```

Запрос требует JWT-токен.

### Проверка сервера

```text
GET /api/health
```

## Установка и запуск

### 1. Клонирование проекта

```bash
git clone <repository-url>
cd music-platform
```

### 2. Установка зависимостей frontend

```bash
npm install
```

### 3. Установка зависимостей backend

```bash
cd backend
npm install
cd ..
```

### 4. Настройка переменных окружения

Создайте файл `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5001
```

`JWT_SECRET` должен быть заменён на собственный секретный ключ. Не добавляйте реальные секреты в публичный репозиторий.

### 5. Генерация Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 6. Применение миграций

```bash
npm run prisma:migrate
```

### 7. Запуск проекта

Из корневой директории:

```bash
npm run dev
```

Команда запускает frontend и backend одновременно.

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5001
```

## Отдельный запуск

### Frontend

```bash
npm start
```

### Backend

```bash
cd backend
npm run dev
```

## Сборка

Frontend:

```bash
npm run build
```

Backend:

```bash
cd backend
npm run build
npm start
```

## Prisma Studio

Для просмотра содержимого базы данных:

```bash
cd backend
npm run prisma:studio
```

## Архитектура

Приложение построено по клиент-серверной архитектуре:

```text
React + TypeScript
        │
        │ REST API / JWT
        ▼
Node.js + Express
        │
        ├── Routes
        ├── Middleware
        ├── Controllers
        └── Services
              │
              └── Prisma ORM
                    │
                    ▼
                 SQLite
```

Основная логика безопасности сосредоточена в `AuthService`, `RiskService`, `EventService`, `authMiddleware` и `adminMiddleware`.

## Безопасность

Пароли пользователей не хранятся в открытом виде — перед сохранением они хешируются с использованием `bcryptjs`.

Для доступа к защищённым API используется JWT. Сервер проверяет токен в `authMiddleware`, после чего данные пользователя становятся доступны последующим обработчикам запроса.

Административные маршруты дополнительно защищены `adminMiddleware`, который проверяет наличие роли `admin`.

События пользовательской активности сохраняются в базе данных и используются системой оценки риска для адаптивного контроля доступа.

## Примечание

Проект предназначен для демонстрации механизмов аутентификации, авторизации, мониторинга событий, оценки риска и динамического управления доступом в веб-приложении.
