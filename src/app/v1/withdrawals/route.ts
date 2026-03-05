import { sleep } from '@/shared/lib/sleep'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = (await req.json().catch(() => null)) as {
		amount?: number
		destination?: string
		idempotency_key?: string
	} | null

	// небольшой делей
	await sleep(2000)

	if (!body?.idempotency_key) {
		return NextResponse.json(
			{ message: 'missing idempotency_key' },
			{ status: 400 },
		)
	}

	if (body.destination === 'conflict') {
		return NextResponse.json({ message: 'conflict' }, { status: 409 })
	}

	if (body.destination === 'server') {
		return NextResponse.json({ message: 'server error' }, { status: 500 })
	}

	return NextResponse.json({ id: 'w_e2e_123' }, { status: 200 })
}
