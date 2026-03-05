import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/v1/withdrawals', async ({ request }) => {
    const body = (await request.json()) as any
    const idem = (body as any)?.idempotency_key

    if (!idem) {
      return HttpResponse.json({ message: 'missing idempotency-key' }, { status: 400 })
    }

    if (body?.destination === 'conflict') {
      return HttpResponse.json({ message: 'conflict' }, { status: 409 })
    }

    if (body?.destination === 'network') {
      return HttpResponse.error()
    }

    return HttpResponse.json({ id: 'w_123' }, { status: 200 })
  }),

  http.get('/v1/withdrawals/:id', ({ params }) => {
    const id = String(params.id)
    return HttpResponse.json({
      id,
      amount: 10,
      destination: 'demo-destination',
      currency: 'USDT',
      status: 'pending',
      created_at: new Date('2026-03-04T12:00:00.000Z').toISOString(),
    })
  }),
]
