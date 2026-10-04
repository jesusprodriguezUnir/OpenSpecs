import { expect, test, type Page } from '@playwright/test';
import { FALLBACK_SITE_URL, resolveSiteUrl } from '../../src/config/site.mjs';
import { E2E_SITE_URL } from '../../playwright.config';
import { robotsTxt } from '../../src/lib/seo';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

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

const OG_PROPERTIES = [
	'og:title',
	'og:description',
	'og:url',
	'og:type',
	'og:locale',
	'og:site_name',
	'og:image',
	'og:image:width',
	'og:image:height',
	'og:image:alt',
];

const meta = (page: Page, key: string) =>
	page.locator(`head meta[property="${key}"], head meta[name="${key}"]`);

async function jsonLdTypes(page: Page): Promise<{ '@type': string; [key: string]: unknown }[]> {
	const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
	return blocks.map((block) => JSON.parse(block));
}

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page.$$eval('script', (nodes) =>
		nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
	);

test.describe('seo: tarjetas sociales', () => {
	test('Scenario: Open Graph completo en una guía', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		for (const key of OG_PROPERTIES) {
			await expect(meta(page, key), key).toHaveCount(1);
			expect(await meta(page, key).getAttribute('content'), key).toBeTruthy();
		}
		await expect(meta(page, 'og:type')).toHaveAttribute('content', 'article');
		await expect(meta(page, 'og:locale')).toHaveAttribute('content', 'es_ES');
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		await expect(meta(page, 'og:url')).toHaveAttribute('content', canonical!);
	});

	test('Scenario: og:type website en la landing', async ({ page }) => {
		await page.goto('/');
		await expect(meta(page, 'og:type')).toHaveAttribute('content', 'website');
	});

	test('Scenario: La imagen OG existe', async ({ page, request }) => {
		for (const path of ['/', '/empieza/que-es/', '/guias/recetas/', '/agentes/otros/', '/equipo/ci/', '/referencia/cli/', '/recursos/', '/como-se-hizo/']) {
			await page.goto(path);
			const image = await meta(page, 'og:image').getAttribute('content');
			expect(image, path).toMatch(new RegExp(`^${E2E_SITE_URL}/og/[a-z-]+\.png$`));
			const response = await request.get(new URL(image!).pathname);
			expect(response.status(), path).toBe(200);
			expect(response.headers()['content-type'], path).toContain('image/png');
		}
	});

	test('Scenario: Tarjeta grande en una guía', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		await expect(meta(page, 'twitter:card')).toHaveCount(1);
		await expect(meta(page, 'twitter:card')).toHaveAttribute('content', 'summary_large_image');
		await expect(meta(page, 'twitter:site')).toHaveCount(0);
		await expect(meta(page, 'twitter:creator')).toHaveCount(0);
	});
});

test.describe('seo: JSON-LD', () => {
	test('Scenario: WebSite en la landing', async ({ page }) => {
		await page.goto('/');
		const website = (await jsonLdTypes(page)).find((d) => d['@type'] === 'WebSite');
		expect(website).toBeDefined();
		expect(website!.inLanguage).toBe('es-ES');
		expect(website!.url).toBe(E2E_SITE_URL);
	});

	test('Scenario: Sin WebSite en una guía', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		expect((await jsonLdTypes(page)).map((d) => d['@type'])).not.toContain('WebSite');
	});

	test('Scenario: TechArticle en una página de referencia', async ({ page }) => {
		await page.goto('/referencia/glosario/');
		const article = (await jsonLdTypes(page)).find((d) => d['@type'] === 'TechArticle');
		expect(article).toBeDefined();
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(article!.url).toBe(canonical);
		expect(article!.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(article).not.toHaveProperty('datePublished');
	});

	test('Scenario: Sin TechArticle fuera de guías', async ({ page }) => {
		await page.goto('/recursos/');
		expect((await jsonLdTypes(page)).map((d) => d['@type'])).not.toContain('TechArticle');
	});

	test('Scenario: Sin migas en la landing y la 404', async ({ page }) => {
		for (const path of ['/', '/esta-ruta-no-existe/']) {
			await page.goto(path);
			expect((await jsonLdTypes(page)).map((d) => d['@type']), path).not.toContain('BreadcrumbList');
		}
	});

	test('Scenario: Las URLs de las migas existen', async ({ page, request }) => {
		const firstInSidebar = async (label: string) =>
			page
				.locator('nav.sidebar details')
				.filter({ has: page.locator('summary', { hasText: label }) })
				.locator('a')
				.first()
				.getAttribute('href');
		for (const path of ['/empieza/que-es/', '/guias/formato-de-specs/', '/agentes/otros/', '/equipo/ci/', '/referencia/cli/', '/recursos/', '/como-se-hizo/']) {
			await page.goto(path);
			const list = (await jsonLdTypes(page)).find((d) => d['@type'] === 'BreadcrumbList') as
				| { itemListElement: { name: string; item: string }[] }
				| undefined;
			expect(list, path).toBeDefined();
			for (const crumb of list!.itemListElement) {
				const response = await request.get(new URL(crumb.item).pathname);
				expect(response.status(), `${path} → ${crumb.item}`).toBe(200);
			}
			if (list!.itemListElement.length === 3) {
				const section = list!.itemListElement[1]!;
				expect(new URL(section.item).pathname, path).toBe(await firstInSidebar(section.name));
			}
		}
	});

	test('Scenario: Solo scripts JSON-LD añadidos', async ({ page }) => {
		// Every script that carries structured data is a non-executable JSON-LD block.
		await page.goto('/empieza/que-es/');
		const guide = await scriptsOf(page);
		const executable = executableScripts(guide);
		expect(executable.filter((s) => s.content.includes('schema.org'))).toEqual([]);
		expect(guide.length - executable.length).toBeGreaterThan(0);
		// The landing gets JSON-LD from this change while the 404 gets none: same executable scripts.
		await page.goto('/');
		const landing = executableScripts(await scriptsOf(page));
		await page.goto('/esta-ruta-no-existe/');
		const notFound = executableScripts(await scriptsOf(page));
		expect(scriptExtras(landing, notFound)).toEqual([]);
	});
});

test.describe('seo: robots.txt', () => {
	test('Scenario: robots.txt permite todo', async ({ request }) => {
		const response = await request.get('/robots.txt');
		expect(response.status()).toBe(200);
		const body = await response.text();
		expect(body).toContain('User-agent: *');
		expect(body).toContain('Allow: /');
		expect(body).toContain(`Sitemap: ${E2E_SITE_URL}/sitemap-index.xml`);
	});

	test('Scenario: Sitemap con SITE_URL ausente', () => {
		expect(robotsTxt(resolveSiteUrl({}))).toContain('Sitemap: http://localhost:4321/sitemap-index.xml');
	});
});
