import type { Withdrawal } from '@/entities/withdrawal'

export type UiStatus = 'idle' | 'loading' | 'success' | 'error'

export type StatusState = {
  status: UiStatus
  error: string | null
  withdrawal: Withdrawal | null
}
