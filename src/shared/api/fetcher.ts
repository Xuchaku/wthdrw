import { API_BASE_URL } from '@/shared/config/env'

export type ApiErrorKind = 'http' | 'network' | 'unknown'

export type ApiError = {
	kind: ApiErrorKind
	status?: number
	message: string
	details?: unknown
}

export type FetcherOptions = {
	path: string
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	headers?: Record<string, string>
	body?: unknown
	signal?: AbortSignal
}

const toMessage = (e: unknown) => {
	if (e instanceof Error) return e.message
	return 'Unknown error'
}

export async function fetcher<T>(opts: FetcherOptions): Promise<T> {
	const url = `${API_BASE_URL}${opts.path}`
	const init: RequestInit = {
		method: opts.method ?? 'GET',
		headers: {
			'content-type': 'application/json',
			...(opts.headers ?? {}),
		},
		signal: opts.signal,
	}

	if (opts.body !== undefined) init.body = JSON.stringify(opts.body)

	let res: Response
	try {
		res = await fetch(url, init)
	} catch (e) {
		throw <ApiError>{
			kind: 'network',
			message: 'Сетевая ошибка. Проверьте соединение и попробуйте снова.',
			details: toMessage(e),
		}
	}

	const contentType = res.headers.get('content-type') ?? ''
	const isJson = contentType.includes('application/json')
	const payload = isJson
		? await res.json().catch(() => null)
		: await res.text().catch(() => null)

	if (!res.ok) {
		const message =
			typeof payload === 'object' && payload && 'message' in payload
				? String((payload as any).message)
				: 'Ошибка запроса'

		throw <ApiError>{
			kind: 'http',
			status: res.status,
			message,
			details: payload,
		}
	}

	return payload as T
}
