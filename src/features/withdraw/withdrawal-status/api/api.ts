import { fetcher, type ApiError } from '@/shared/api/fetcher'
import type { Withdrawal } from '@/entities/withdrawal'

export async function getWithdrawalById(id: string) {
  try {
    return await fetcher<Withdrawal>({
      path: `/v1/withdrawals/${encodeURIComponent(id)}`,
      method: 'GET',
    })
  } catch (e) {
    const err = e as ApiError
    if (err.kind === 'network') throw new Error(err.message)
    throw new Error('Не удалось получить статус заявки.')
  }
}
