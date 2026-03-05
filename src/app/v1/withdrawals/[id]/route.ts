import { sleep } from '@/shared/lib/sleep'
import { NextResponse } from 'next/server'

export async function GET(
	_: Request,
	ctx: { params: Promise<{ id: string }> },
) {
	// небольшой делей
	await sleep(2000)

	const { id } = await ctx.params

	return NextResponse.json({
		id,
		amount: 10,
		destination: 'demo-destination',
		currency: 'USDT',
		status: 'pending',
		created_at: new Date().toISOString(),
	})
}
