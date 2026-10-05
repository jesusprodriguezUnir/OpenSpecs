// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { resolveSiteUrl } from './src/config/site.mjs';

// https://astro.build/config
export default defineConfig({
	site: resolveSiteUrl(process.env),
	integrations: [
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
				{ label: 'Recursos', items: [{ slug: 'recursos' }] },
				{ label: 'Cómo se hizo', items: [{ slug: 'como-se-hizo' }] },
			],
		}),
	],
});
