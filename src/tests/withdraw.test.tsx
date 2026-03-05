import { server } from '@/shared/test/msw/server'
import { WithdrawWidget } from '@/widgets/withdraw'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

const fillValid = async (
	user: ReturnType<typeof userEvent.setup>,
	destinationValue = 'demo-destination',
) => {
	await user.clear(screen.getByPlaceholderText('Например 10'))
	await user.type(screen.getByPlaceholderText('Например 10'), '10')
	await user.clear(screen.getByPlaceholderText('Адрес / кошелек / реквизиты'))
	await user.type(
		screen.getByPlaceholderText('Адрес / кошелек / реквизиты'),
		destinationValue,
	)
	await user.click(screen.getByLabelText('Я подтверждаю вывод средств'))
}

describe('WithdrawWidget', () => {
	test('happy-path submit', async () => {
		const user = userEvent.setup()
		render(<WithdrawWidget />)

		await fillValid(user)

		await user.click(screen.getByRole('button', { name: 'submit' }))

		// expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled()

		await screen.findByRole('alert')
		expect(screen.getByText(/Заявка создана/i)).toBeInTheDocument()

		await screen.findByLabelText('Withdrawal')
		expect(screen.getByText('w_123')).toBeInTheDocument()
	})

	test('api error 409 shows friendly message', async () => {
		const user = userEvent.setup()
		render(<WithdrawWidget />)

		await fillValid(user, 'conflict')

		await user.click(screen.getByRole('button', { name: 'submit' }))

		await screen.findByRole('alert')
		expect(screen.getByText(/Конфликт \(409\)/i)).toBeInTheDocument()
		expect(
			screen.getByText(/Такая операция уже отправлена/i),
		).toBeInTheDocument()
	})

	test('api error 500 shows generic message', async () => {
		const user = userEvent.setup()

		server.use(
			http.post('/v1/withdrawals', async () => {
				return HttpResponse.json({ message: 'server error' }, { status: 500 })
			}),
		)

		render(<WithdrawWidget />)

		await fillValid(user, 'demo-destination')
		await user.click(screen.getByRole('button', { name: 'submit' }))

		await screen.findByRole('alert')
		expect(screen.getByText(/Ошибка/i)).toBeInTheDocument()
		expect(screen.getByText(/Не удалось создать заявку/i)).toBeInTheDocument()
	})

	test('network error shows retry and keeps form data', async () => {
		const user = userEvent.setup()
		render(<WithdrawWidget />)

		await fillValid(user, 'network')
		await user.click(screen.getByRole('button', { name: 'submit' }))

		await screen.findByRole('alert')
		expect(screen.getByText(/Сетевая ошибка/i)).toBeInTheDocument()
		const retryBtn = screen.getByRole('button', { name: 'retry' })
		expect(retryBtn).toBeInTheDocument()

		expect(screen.getByPlaceholderText('Например 10')).toHaveValue('10')
		expect(
			screen.getByPlaceholderText('Адрес \/ кошелек \/ реквизиты'),
		).toHaveValue('network')

		server.use(
			http.post('/v1/withdrawals', async () => {
				return HttpResponse.json({ id: 'w_999' }, { status: 200 })
			}),
		)

		await user.click(retryBtn)
		await screen.findByText(/Заявка создана/i)
		const details = await screen.findByLabelText('Withdrawal')
		expect(details).toHaveTextContent('w_999')
	})

	test('double submit protection sends only one request', async () => {
		const user = userEvent.setup()
		let calls = 0

		server.use(
			http.post('/v1/withdrawals', async () => {
				calls += 1
				return HttpResponse.json({ id: 'w_123' })
			}),
		)

		render(<WithdrawWidget />)
		await fillValid(user)

		const btn = screen.getByRole('button', { name: 'submit' })
		await user.dblClick(btn)

		await waitFor(() =>
			expect(screen.getByText(/Заявка создана/i)).toBeInTheDocument(),
		)
		expect(calls).toBe(1)
	})

	test('409 shows friendly text', async () => {
		const user = userEvent.setup()
		render(<WithdrawWidget />)

		await fillValid(user, 'conflict')
		await user.click(screen.getByRole('button', { name: 'submit' }))

		await screen.findByRole('alert')
		expect(screen.getByText(/Конфликт\s*\(409\)/i)).toBeInTheDocument()
		expect(
			screen.getByText(/Такая операция уже отправлена/i),
		).toBeInTheDocument()
	})

	test('network error: shows retry and keeps entered data', async () => {
		const user = userEvent.setup()
		render(<WithdrawWidget />)

		await fillValid(user, 'network')
		await user.click(screen.getByRole('button', { name: 'submit' }))

		await screen.findByRole('alert')
		expect(screen.getByText(/Сетевая ошибка/i)).toBeInTheDocument()

		const retryBtn = screen.getByRole('button', { name: 'retry' })
		expect(retryBtn).toBeInTheDocument()

		expect(screen.getByPlaceholderText('Например 10')).toHaveValue('10')
		expect(
			screen.getByPlaceholderText('Адрес / кошелек / реквизиты'),
		).toHaveValue('network')

		server.use(
			http.post('/v1/withdrawals', async () => {
				return HttpResponse.json({ id: 'w_999' }, { status: 200 })
			}),
		)

		await user.click(retryBtn)

		await screen.findByRole('alert')
		expect(screen.getByText(/Заявка создана/i)).toBeInTheDocument()

		const details = await screen.findByLabelText('Withdrawal')
		expect(details).toHaveTextContent('w_999')
	})
})
