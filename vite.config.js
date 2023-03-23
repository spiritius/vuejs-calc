import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	base: '',
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => ['md-linedivider'].includes(tag),
				},
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
