import { z } from 'zod'

export const withdrawSchema = z
	.object({
		amount: z.coerce.number().positive('Введите сумму больше 0'),
		destination: z.string().min(3, 'Введите destination'),
		confirm: z.boolean(),
	})
	.refine(v => v.confirm === true, {
		message: 'Нужно подтвердить вывод',
		path: ['confirm'],
	})

export type WithdrawSchema = z.infer<typeof withdrawSchema>
