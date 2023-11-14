import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: 'src/main.ts',
			name: 'latte',
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			external: [],
			output: {
				globals: {},
			},
		},
	},
})
