import { fetcher, type ApiError } from '@/shared/api/fetcher'
import type { CreateWithdrawalResponse } from '../model/types'

export async function createWithdrawal(input: {
	amount: number
	destination: string
	idempotencyKey: string
}) {
	try {
		return await fetcher<CreateWithdrawalResponse>({
			path: '/v1/withdrawals',
			method: 'POST',
			body: {
				amount: input.amount,
				destination: input.destination,
				idempotency_key: input.idempotencyKey,
			},
		})
	} catch (e) {
		const err = e as ApiError
		if (err.kind === 'http' && err.status === 409) {
			const friendly =
				'Такая операция уже отправлена (409). Если вы нажали дважды — всё ок: проверьте статус заявки.'
			throw { kind: 'conflict', message: friendly } as const
		}
		if (err.kind === 'network')
			throw { kind: 'network', message: err.message } as const
		throw {
			kind: 'unknown',
			message: 'Не удалось создать заявку. Попробуйте снова.',
		} as const
	}
}
