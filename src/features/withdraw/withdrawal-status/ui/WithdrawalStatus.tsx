'use client'

import { useEffect } from 'react'
import { useWithdrawalStatusStore } from '../model/store'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { WithdrawalCard } from '@/entities/withdrawal'

export function WithdrawalStatus({ id }: { id: string }) {
  const status = useWithdrawalStatusStore((s) => s.status)
  const error = useWithdrawalStatusStore((s) => s.error)
  const withdrawal = useWithdrawalStatusStore((s) => s.withdrawal)
  const fetchStatus = useWithdrawalStatusStore((s) => s.fetchStatus)

  useEffect(() => {
    if (!id) return
    fetchStatus(id)
  }, [id, fetchStatus])

  if (!id) return null

  if (status === 'loading') {
    return (
      <div style={{ marginTop: 14, color: 'var(--muted)', fontSize: 13 }} aria-label="status-loading">
        Загружаем статус заявки…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{ marginTop: 14 }}>
        <Alert
          tone="danger"
          title="Ошибка статуса"
          message={error ?? 'Ошибка'}
          actions={
            <Button onClick={() => fetchStatus(id)} tone="ghost">
              Обновить
            </Button>
          }
        />
      </div>
    )
  }

  if (withdrawal) {
    return (
      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        <WithdrawalCard w={withdrawal} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button onClick={() => fetchStatus(id)} tone="ghost">
            Refresh status
          </Button>
        </div>
      </div>
    )
  }

  return null
}
