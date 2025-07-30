import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		SvelteKitPWA({
			registerType: 'autoUpdate',

			manifest: {
				name: 'Health AI',
				short_name: 'Health AI',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#21235f',
				icons: [
					{
						src: '/icons/192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},

			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

			workbox: {
				// Allow large files like images up to 6 MB
				maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

				// Only cache valid static files
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],

				// Skip over any very large or unnecessary assets
				// globIgnores: [
				//   'server/**',
				//   'server/sw.js',
				//   'server/workbox-*.js'
				// ],

				// Runtime caching for dynamic API or external services
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/zutudrfpiiewreytnvmm\.supabase\.co\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'supabase-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 86400 // 1 day
							},
							networkTimeoutSeconds: 10
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							}
						}
					}
				]
			}
		})
	]
});
