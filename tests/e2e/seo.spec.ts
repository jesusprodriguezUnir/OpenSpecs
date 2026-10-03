import { expect, test } from '@playwright/test';
import { FALLBACK_SITE_URL, resolveSiteUrl } from '../../src/config/site.mjs';
import { E2E_SITE_URL } from '../../playwright.config';

const SITE_SUFFIX = '| OpenSpec desde cero';

async function readLinkedSitemap(request: import('@playwright/test').APIRequestContext) {
	const index = await (await request.get('/sitemap-index.xml')).text();
	const loc = index.match(/<loc>([^<]+)<\/loc>/)?.[1];
	expect(loc, 'sitemap-index.xml must link a sitemap').toBeTruthy();
	const path = new URL(loc!).pathname;
	return (await request.get(path)).text();
}

test.describe('seo', () => {
	test('Scenario: lang es-ES en una página de guía', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');
	});

	test('Scenario: lang es-ES en la portada y en la 404', async ({ page }) => {
		for (const path of ['/', '/esta-ruta-no-existe/']) {
			await page.goto(path);
			await expect(page.locator('html'), path).toHaveAttribute('lang', 'es-ES');
		}
	});

	test('Scenario: URLs sin prefijo de locale', async ({ page }) => {
		const response = await page.goto('/es-es/empieza/que-es/');
		expect(response?.status()).toBe(404);
	});

	test('Scenario: Título de una página de guía', async ({ page }) => {
		await page.goto('/guias/formato-de-specs/');
		expect((await page.title()).endsWith(SITE_SUFFIX)).toBe(true);
	});

	test('Scenario: Canónica con SITE_URL definida', async ({ page }) => {
		await page.goto('/empieza/instalacion/');
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`${E2E_SITE_URL}/empieza/instalacion/`,
		);
	});

	test('Scenario: Canónica con SITE_URL ausente', () => {
		expect(resolveSiteUrl({})).toBe(FALLBACK_SITE_URL);
		expect(new URL('/empieza/instalacion/', resolveSiteUrl({})).href).toBe(
			'http://localhost:4321/empieza/instalacion/',
		);
	});

	test('Scenario: Página de guía presente en el sitemap', async ({ request }) => {
		const sitemap = await readLinkedSitemap(request);
		expect(sitemap).toContain(`<loc>${E2E_SITE_URL}/empieza/primer-cambio/</loc>`);
	});

	test('Scenario: La 404 no aparece en el sitemap', async ({ request }) => {
		const sitemap = await readLinkedSitemap(request);
		expect(sitemap).not.toMatch(/\/404\/?<\/loc>/);
	});
});
