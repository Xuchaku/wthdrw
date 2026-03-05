export type WithdrawFormValues = {
	amount: number
	destination: string
	confirm: boolean
}

export type CreateWithdrawalResponse = {
	id: string
}

export type UiStatus = 'idle' | 'loading' | 'success' | 'error'

export type CreateWithdrawalError = {
	kind: 'conflict' | 'network' | 'unknown'
	message: string
}

export type LastRequest = {
	payload: Omit<WithdrawFormValues, 'confirm'>
	idempotencyKey: string
}
