import { WithdrawWidget } from '@/widgets/withdraw'

export default function WithdrawPage() {
	return (
		<main style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
			<h1 style={{ margin: '10px 0 14px', fontSize: 28, letterSpacing: -0.2 }}>
				Withdraw
			</h1>
			<WithdrawWidget />
		</main>
	)
}
