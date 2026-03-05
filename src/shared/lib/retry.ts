export async function withRetry<T>(
	fn: () => Promise<T>,
	opts?: { retries?: number; delayMs?: number },
) {
	const retries = opts?.retries ?? 0
	const delayMs = opts?.delayMs ?? 300
	let lastErr: unknown = null
	for (let i = 0; i <= retries; i += 1) {
		try {
			return await fn()
		} catch (e) {
			lastErr = e
			if (i === retries) break
			await new Promise(r => setTimeout(r, delayMs))
		}
	}
	throw lastErr
}
