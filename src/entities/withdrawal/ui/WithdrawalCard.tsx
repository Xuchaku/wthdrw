import type { Withdrawal } from '@/entities/withdrawal/model/types'

export function WithdrawalCard({ w }: { w: Withdrawal }) {
	const badge = (() => {
		const map: Record<string, { text: string; bg: string; bd: string }> = {
			pending: {
				text: 'pending',
				bg: 'rgba(148,163,184,.10)',
				bd: 'rgba(148,163,184,.28)',
			},
			processing: {
				text: 'processing',
				bg: 'rgba(124,58,237,.12)',
				bd: 'rgba(124,58,237,.35)',
			},
			completed: {
				text: 'completed',
				bg: 'rgba(34,197,94,.12)',
				bd: 'rgba(34,197,94,.35)',
			},
			failed: {
				text: 'failed',
				bg: 'rgba(239,68,68,.12)',
				bd: 'rgba(239,68,68,.35)',
			},
		}
		return map[w.status] ?? map.pending
	})()

	return (
		<section
			aria-label='Withdrawal'
			style={{
				borderRadius: 16,
				border: '1px solid var(--border)',
				background: 'rgba(18,24,38,.72)',
				boxShadow: 'var(--shadow)',
				padding: 16,
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: 10,
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					<div style={{ fontSize: 13, color: 'var(--muted)' }}>Заявка</div>
					<div style={{ fontWeight: 700, letterSpacing: -0.2 }}>{w.id}</div>
				</div>
				<span
					style={{
						padding: '6px 10px',
						borderRadius: 999,
						fontSize: 12,
						background: badge.bg,
						border: `1px solid ${badge.bd}`,
					}}
				>
					{badge.text}
				</span>
			</div>

			<div
				style={{
					marginTop: 12,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 12,
				}}
			>
				<div>
					<div style={{ fontSize: 12, color: 'var(--muted)' }}>Сумма</div>
					<div style={{ fontSize: 16, fontWeight: 650 }}>
						{w.amount} {w.currency}
					</div>
				</div>
				<div>
					<div style={{ fontSize: 12, color: 'var(--muted)' }}>Destination</div>
					<div
						style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}
					>
						{w.destination}
					</div>
				</div>
				<div>
					<div style={{ fontSize: 12, color: 'var(--muted)' }}>Создано</div>
					<div style={{ fontSize: 14 }}>
						{new Date(w.created_at).toLocaleString('ru-RU')}
					</div>
				</div>
			</div>
		</section>
	)
}
