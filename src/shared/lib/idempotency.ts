export function generateIdempotencyKey() {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
		return crypto.randomUUID()
	return `idem_${Math.random().toString(16).slice(2)}_${Date.now()}`
}
