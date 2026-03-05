import { create } from 'zustand'
import type { StatusState } from './types'
import { getWithdrawalById } from '../api/api'

type Actions = {
  fetchStatus: (id: string) => Promise<void>
  reset: () => void
}

export const useWithdrawalStatusStore = create<StatusState & Actions>((set, get) => ({
  status: 'idle',
  error: null,
  withdrawal: null,

  fetchStatus: async (id) => {
    const state = get()
    if (state.status === 'loading') return
    set({ status: 'loading', error: null })
    try {
      const w = await getWithdrawalById(id)
      set({ status: 'success', withdrawal: w })
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Ошибка' })
    }
  },

  reset: () => set({ status: 'idle', error: null, withdrawal: null }),
}))
