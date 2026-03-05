type Props = {
	title?: string
	message: string
	tone?: 'danger' | 'info' | 'success'
	actions?: React.ReactNode
}

const tones: Record<string, { border: string; bg: string }> = {
	danger: { border: 'rgba(239,68,68,.45)', bg: 'rgba(239,68,68,.10)' },
	success: { border: 'rgba(34,197,94,.45)', bg: 'rgba(34,197,94,.10)' },
	info: { border: 'rgba(148,163,184,.30)', bg: 'rgba(148,163,184,.10)' },
}

export function Alert({ title, message, tone = 'info', actions }: Props) {
	return (
		<div
			role='alert'
			style={{
				borderRadius: 14,
				border: `1px solid ${tones[tone].border}`,
				background: tones[tone].bg,
				padding: 14,
			}}
		>
			{title ? (
				<div style={{ fontWeight: 650, marginBottom: 6 }}>{title}</div>
			) : null}
			<div style={{ color: 'var(--text)', opacity: 0.92, lineHeight: 1.35 }}>
				{message}
			</div>
			{actions ? (
				<div
					style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}
				>
					{actions}
				</div>
			) : null}
		</div>
	)
}
