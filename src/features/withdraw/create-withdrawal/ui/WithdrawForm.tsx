'use client'

import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Input } from '@/shared/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateWithdrawalStore } from '../model/store'
import { withdrawSchema, type WithdrawSchema } from '../schema'

type WithdrawFormValues = {
	amount: string
	destination: string
	confirm: boolean
}

export function WithdrawForm() {
	const status = useCreateWithdrawalStore(s => s.status)
	const submit = useCreateWithdrawalStore(s => s.submit)
	const formResetKey = useCreateWithdrawalStore(s => s.formResetKey)

	const isLoading = status === 'loading'
	const submitLockRef = useRef(false)

	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		watch,
		reset,
		setValue,
	} = useForm<WithdrawFormValues>({
		resolver: zodResolver(withdrawSchema) as any,
		mode: 'onChange',
		defaultValues: { amount: '', destination: '', confirm: false },
	})

	useEffect(() => {
		reset({ amount: '', destination: '', confirm: false })
		submitLockRef.current = false
	}, [formResetKey, reset])

	useEffect(() => {
		if (!isLoading) submitLockRef.current = false
	}, [isLoading])

	const amount = watch('amount')
	const destination = watch('destination')
	const confirm = watch('confirm')

	const canSubmit = useMemo(
		() => isValid && !isLoading && !submitLockRef.current,
		[isValid, isLoading],
	)

	const onSubmit = handleSubmit(async values => {
		if (submitLockRef.current) return
		submitLockRef.current = true

		const parsed = withdrawSchema.safeParse(values)
		if (!parsed.success) {
			submitLockRef.current = false
			return
		}

		await submit(parsed.data as WithdrawSchema)
	})

	const amountReg = register('amount', {
		validate: v => {
			const raw = String(v ?? '').trim()

			if (raw === '') return
			if (!raw) return 'Заполнить поле'
			if (!/^\d+$/.test(raw)) return 'Введите сумму больше 0'
			const num = Number(raw)
			if (!Number.isFinite(num) || num <= 0) return 'Введите сумму больше 0'
			return true
		},
	})

	return (
		<form
			onSubmit={onSubmit}
			style={{
				borderRadius: 16,
				border: '1px solid var(--border)',
				background: 'rgba(18,24,38,.72)',
				boxShadow: 'var(--shadow)',
				padding: 16,
			}}
			aria-label='WithdrawForm'
		>
			<div style={{ display: 'grid', gap: 12 }}>
				<div>
					<div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
						Amount (USDT)
					</div>

					<Input
						inputMode='numeric'
						placeholder='Например 10'
						disabled={isLoading}
						aria-invalid={Boolean(errors.amount)}
						{...amountReg}
						onChange={e => {
							const onlyDigits = e.target.value.replace(/\D/g, '')
							setValue('amount', onlyDigits, {
								shouldValidate: true,
								shouldDirty: true,
								shouldTouch: true,
							})
						}}
						onPaste={e => {
							e.preventDefault()
							const text = e.clipboardData.getData('text')
							const onlyDigits = text.replace(/\D/g, '')
							const next = String(amount ?? '') + onlyDigits
							setValue('amount', next, {
								shouldValidate: true,
								shouldDirty: true,
								shouldTouch: true,
							})
						}}
						onKeyDown={e => {
							if (e.ctrlKey || e.metaKey || e.altKey) return
							const allowed =
								e.key === 'Backspace' ||
								e.key === 'Delete' ||
								e.key === 'Tab' ||
								e.key === 'Enter' ||
								e.key === 'Escape' ||
								e.key === 'ArrowLeft' ||
								e.key === 'ArrowRight' ||
								e.key === 'Home' ||
								e.key === 'End'
							if (allowed) return
							if (!/^\d$/.test(e.key)) e.preventDefault()
						}}
					/>

					{errors.amount ? (
						<div style={{ marginTop: 6, fontSize: 12, color: 'var(--danger)' }}>
							{String(errors.amount.message)}
						</div>
					) : null}
				</div>

				<div>
					<div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
						Destination
					</div>

					<Input
						placeholder='Адрес / кошелек / реквизиты'
						{...register('destination')}
						aria-invalid={Boolean(errors.destination)}
						disabled={isLoading}
					/>

					{errors.destination ? (
						<div style={{ marginTop: 6, fontSize: 12, color: 'var(--danger)' }}>
							{String(errors.destination.message)}
						</div>
					) : null}
				</div>

				<div>
					<Checkbox
						label='Я подтверждаю вывод средств'
						checked={confirm}
						{...register('confirm')}
						disabled={isLoading}
					/>

					{errors.confirm ? (
						<div style={{ marginTop: 6, fontSize: 12, color: 'var(--danger)' }}>
							{String(errors.confirm.message)}
						</div>
					) : null}
				</div>

				<div
					style={{
						display: 'flex',
						gap: 10,
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Button
						type='submit'
						tone='primary'
						disabled={!canSubmit}
						aria-label='submit'
					>
						{isLoading ? 'Отправляем…' : 'Submit'}
					</Button>

					<div style={{ fontSize: 12, color: 'var(--muted)' }}>
						{canSubmit
							? 'Форма валидна'
							: 'Заполните поля и подтвердите чекбокс'}
					</div>
				</div>
			</div>
		</form>
	)
}
