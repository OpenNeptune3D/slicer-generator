import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/slicer-generator/',
	plugins: [
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
				additionalPrerenderRoutes: ['/404'],
			},
		}),
	],
});
