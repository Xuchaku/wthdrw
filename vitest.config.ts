import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
		css: false,
		typecheck: {
			tsconfig: './tsconfig.vitest.json',
		},
	},
	esbuild: {
		jsx: 'automatic',
	},
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname,
		},
	},
})
