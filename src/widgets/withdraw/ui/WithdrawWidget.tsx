'use client'

import {
	WithdrawForm,
	useCreateWithdrawalStore,
} from '@/features/withdraw/create-withdrawal'
import { WithdrawalStatus } from '@/features/withdraw/withdrawal-status'
import { Alert } from '@/shared/ui/Alert'
import { Button } from '@/shared/ui/Button'
import { useEffect } from 'react'

export function WithdrawWidget() {
	const status = useCreateWithdrawalStore(s => s.status)
	const error = useCreateWithdrawalStore(s => s.error)
	const withdrawalId = useCreateWithdrawalStore(s => s.withdrawalId)
	const retryLast = useCreateWithdrawalStore(s => s.retryLast)
	const reset = useCreateWithdrawalStore(s => s.reset)
	const hydrate = useCreateWithdrawalStore(s => s.hydrateFromStorage)

	useEffect(() => {
		hydrate()
	}, [hydrate])

	return (
		<section style={{ display: 'grid', gap: 14 }}>
			<WithdrawForm />

			{status === 'error' && error ? (
				<Alert
					tone='danger'
					title={error.kind === 'conflict' ? 'Конфликт (409)' : 'Ошибка'}
					message={error.message}
					actions={
						<>
							{error.kind === 'network' ? (
								<Button
									onClick={() => retryLast()}
									tone='ghost'
									aria-label='retry'
								>
									Retry
								</Button>
							) : null}
							<Button onClick={() => reset()} tone='ghost'>
								Сбросить
							</Button>
						</>
					}
				/>
			) : null}

			{status === 'success' && withdrawalId ? (
				<Alert
					tone='success'
					title='Заявка создана'
					message={`ID: ${withdrawalId}. Ниже — актуальный статус.`}
					actions={
						<Button onClick={() => reset()} tone='ghost'>
							Создать новую
						</Button>
					}
				/>
			) : null}

			{withdrawalId ? <WithdrawalStatus id={withdrawalId} /> : null}
		</section>
	)
}
