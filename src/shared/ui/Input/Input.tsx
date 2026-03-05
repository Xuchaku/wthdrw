import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input(props: Props) {
	return (
		<input
			{...props}
			style={{
				width: '100%',
				padding: '10px 12px',
				borderRadius: 12,
				border: '1px solid var(--border)',
				background: 'rgba(148,163,184,.06)',
				color: 'var(--text)',
				outline: 'none',
				fontSize: 14,
			}}
		/>
	)
}
