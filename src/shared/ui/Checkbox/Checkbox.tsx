import type { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	label: string
}

export function Checkbox({ label, ...props }: Props) {
	return (
		<label
			style={{
				display: 'flex',
				gap: 10,
				alignItems: 'flex-start',
				cursor: 'pointer',
			}}
		>
			<input
				{...props}
				type='checkbox'
				style={{ marginTop: 3, width: 16, height: 16 }}
			/>
			<span style={{ fontSize: 14, color: 'var(--text)' }}>{label}</span>
		</label>
	)
}
