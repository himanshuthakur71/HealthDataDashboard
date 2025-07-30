import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), SvelteKitPWA({
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
		workbox: {
			globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
			runtimeCaching: [
				{
					urlPattern: /^https:\/\/your-api\.com\/.*$/,
					handler: 'NetworkFirst',
					options: {
						cacheName: 'api-cache',
						expiration: {
							maxEntries: 50,
							maxAgeSeconds: 86400
						}
					}
				}
			]
		}
	})]
});
