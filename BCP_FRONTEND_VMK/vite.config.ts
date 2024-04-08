import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// biome-ignore lint/style/useNodejsImportProtocol:
import path from "path";

export default defineConfig({
	plugins: [solid()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
