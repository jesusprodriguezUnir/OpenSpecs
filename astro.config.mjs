// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { resolveSiteUrl } from './src/config/site.mjs';
import { MANUAL_PDF_PATH, MANUAL_PDF_SIZE } from './src/config/manual.mjs';

// https://astro.build/config
export default defineConfig({
	site: resolveSiteUrl(process.env),
	integrations: [
		// Declared explicitly (Starlight then skips its own copy) to keep the printable /manual/ out (w14).
		sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/manual/') }),
		starlight({
			title: 'OpenSpec desde cero',
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es-ES' },
			},
			components: {
				Hero: "./src/components/overrides/Hero.astro",
					PageTitle: "./src/components/overrides/PageTitle.astro",
				Footer: "./src/components/overrides/Footer.astro",
			},
			// Vercel Web Analytics, same origin and cookieless (w11).
			head: [
				{
					tag: 'script',
					content:
						'window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };',
				},
				{ tag: 'script', attrs: { defer: true, src: '/_vercel/insights/script.js' } },
			],
			routeMiddleware: './src/route-middleware.ts',
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: 'Empieza', items: [{ autogenerate: { directory: 'empieza' } }] },
				{ label: 'Guías', items: [{ autogenerate: { directory: 'guias' } }] },
				{ label: 'Con tu agente', items: [{ autogenerate: { directory: 'agentes' } }] },
				{ label: 'En equipo', items: [{ autogenerate: { directory: 'equipo' } }] },
				{ label: 'Referencia', items: [{ autogenerate: { directory: 'referencia' } }] },
				{
					label: 'Recursos',
					items: [
						{ slug: 'recursos' },
						{ label: `Manual en PDF · ${MANUAL_PDF_SIZE}`, link: MANUAL_PDF_PATH, attrs: { download: '' } },
					],
				},
				{ label: 'Cómo se hizo', items: [{ slug: 'como-se-hizo' }] },
			],
		}),
	],
});
