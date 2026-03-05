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
```
