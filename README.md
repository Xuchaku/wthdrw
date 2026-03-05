# Withdraw (Frontend test) — Next.js App Router + TypeScript + FSD

Реализация тестового задания: страница **Withdraw** с устойчивым UI и интеграцией API:

- `POST /v1/withdrawals` (с `idempotency-key`)
- `GET /v1/withdrawals/{id}`

Архитектура: **FSD (Feature-Sliced Design)**: `shared / entities / features / widgets / app`.

## Запуск

```bash
npm i
npm run dev
```

Открыть: `http://localhost:3000/withdraw`

## Тесты

```bash
npm run test
```

## E2E (Cypress)

```bash
npm run dev
npx cypress run

В тестах используется **MSW** (моки `POST /v1/withdrawals` и `GET /v1/withdrawals/:id`).

## Что реализовано по требованиям

- Валидация формы (amount > 0, destination required, confirm === true)
- Submit доступен только при валидной форме
- Во время запроса submit disabled
- Защита от двойного submit (guard в store + disabled в UI)
- Состояния `idle/loading/success/error`
- Idempotency: `idempotency_key` передаётся в **body** и генерируется через `crypto.randomUUID()`
- Обработка 409: понятное сообщение
- Сетевая ошибка: кнопка Retry без потери введенных данных
- После успеха: отображается заявка и статус (GET по id)
- Optional: восстановление последней заявки после reload до 5 минут (sessionStorage TTL)

## Про безопасность access token

В рамках тестового auth моковая и не используется. Для прод-решения:
- access token хранить в **httpOnly cookie** (а не в localStorage)
- обновление токена через refresh cookie, CSRF защита (SameSite=strict/lax + anti-CSRF токен)
- чувствительные запросы — с серверной прослойкой (route handlers / server actions) при необходимости
```
