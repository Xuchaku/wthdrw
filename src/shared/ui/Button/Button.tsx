import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	tone?: 'primary' | 'ghost' | 'danger'
}

const styles: Record<string, React.CSSProperties> = {
	base: {
		borderRadius: 12,
		padding: '10px 14px',
		fontSize: 14,
		border: '1px solid var(--border)',
		background: 'transparent',
		color: 'var(--text)',
		cursor: 'pointer',
		transition:
			'transform .06s ease, opacity .15s ease, background .15s ease, border-color .15s ease',
		userSelect: 'none',
	},
	primary: { background: 'var(--brand)', borderColor: 'rgba(124,58,237,.45)' },
	danger: { background: 'var(--danger)', borderColor: 'rgba(239,68,68,.45)' },
	ghost: { background: 'rgba(148,163,184,.08)' },
	disabled: { opacity: 0.55, cursor: 'not-allowed' },
}

export function Button({ tone = 'ghost', style, disabled, ...props }: Props) {
	return (
		<button
			{...props}
			disabled={disabled}
			style={{
				...styles.base,
				...(styles[tone] ?? {}),
				...(disabled ? styles.disabled : {}),
				...style,
			}}
		/>
	)
}
