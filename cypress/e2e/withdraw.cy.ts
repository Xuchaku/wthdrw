describe('Withdraw', () => {
	it('happy path: create withdrawal and see status', () => {
		cy.visit('/withdraw')

		cy.findByPlaceholderText('Например 10').clear().type('10')
		cy.findByPlaceholderText('Адрес / кошелек / реквизиты')
			.clear()
			.type('demo-destination')
		cy.contains('Я подтверждаю вывод средств').click()

		cy.findByRole('button', { name: /submit/i }).click()
		cy.findByRole('button', { name: /submit/i }).should('be.disabled')

		cy.findByRole('alert').should('contain.text', 'Заявка создана')
		cy.findByLabelText('Withdrawal').should('contain.text', 'w_e2e_123')
	})
})
