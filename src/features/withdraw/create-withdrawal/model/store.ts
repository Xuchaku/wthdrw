import { generateIdempotencyKey } from '@/shared/lib/idempotency'
import { create } from 'zustand'
import { createWithdrawal } from '../api/api'
import type {
	CreateWithdrawalError,
	LastRequest,
	UiStatus,
	WithdrawFormValues,
} from './types'

type State = {
	formResetKey: number
	status: UiStatus
	error: CreateWithdrawalError | null
	withdrawalId: string | null
	lastRequest: LastRequest | null
	submit: (values: WithdrawFormValues) => Promise<void>
	retryLast: () => Promise<void>
	reset: () => void
	hydrateFromStorage: () => void
}

const STORAGE_KEY = 'withdraw:last'
const TTL_MS = 5 * 60 * 1000

let inFlight = false
let retryInFlight = false

export const useCreateWithdrawalStore = create<State>((set, get) => ({
	formResetKey: 0,
	status: 'idle',
	error: null,
	withdrawalId: null,
	lastRequest: null,

	hydrateFromStorage: () => {
		if (typeof window === 'undefined') return
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY)
			if (!raw) return
			const parsed = JSON.parse(raw) as { id: string; t: number } | null
			if (!parsed) return
			if (Date.now() - parsed.t > TTL_MS) {
				sessionStorage.removeItem(STORAGE_KEY)
				return
			}
			set({ withdrawalId: parsed.id })
		} catch {
			sessionStorage.removeItem(STORAGE_KEY)
		}
	},

	submit: async values => {
		if (inFlight) return
		const state = get()
		if (state.status === 'loading') return

		inFlight = true
		set({ status: 'loading', error: null })

		const idempotencyKey = generateIdempotencyKey()
		const payload = { amount: values.amount, destination: values.destination }
		set({ lastRequest: { payload, idempotencyKey } })

		try {
			const res = await createWithdrawal({ ...payload, idempotencyKey })
			set({ status: 'success', withdrawalId: res.id })
			if (typeof window !== 'undefined') {
				sessionStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ id: res.id, t: Date.now() }),
				)
			}
		} catch (e) {
			set({ status: 'error', error: e as CreateWithdrawalError })
		} finally {
			inFlight = false
		}
	},

	retryLast: async () => {
		if (retryInFlight) return
		const state = get()
		if (state.status === 'loading') return
		if (!state.lastRequest) return

		retryInFlight = true
		set({ status: 'loading', error: null })

		try {
			const res = await createWithdrawal({
				...state.lastRequest.payload,
				idempotencyKey: state.lastRequest.idempotencyKey,
			})
			set({ status: 'success', withdrawalId: res.id })
			if (typeof window !== 'undefined') {
				sessionStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ id: res.id, t: Date.now() }),
				)
			}
		} catch (e) {
			set({ status: 'error', error: e as CreateWithdrawalError })
		} finally {
			retryInFlight = false
		}
	},

	reset: () =>
		set(s => ({
			formResetKey: s.formResetKey + 1,
			status: 'idle',
			error: null,
			withdrawalId: null,
			lastRequest: null,
		})),
}))
