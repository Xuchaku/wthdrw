export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Withdrawal = {
	id: string
	amount: number
	destination: string
	currency: 'USDT'
	status: WithdrawalStatus
	created_at: string
}
