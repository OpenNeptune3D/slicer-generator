import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/slicer-generator/',
	build: {
		sourcemap: true,
	},
	define: {
		__GITHUB_REPO__: JSON.stringify('https://github.com/OpenNeptune3D/slicer-generator'),
		__DISCORD_INVITE__: JSON.stringify('https://discord.gg/rzRnvh5NFv'),
	},
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
