import { expect, test, type BrowserContext } from '@playwright/test';
import { expectNoSevereViolations } from './axe';
import { siteMapSlugs } from './site-map';

const PRIVACY = '/legal/privacidad/';
const GUIDE = '/empieza/que-es/';
const CREDIT_URL = 'https://webdespega.com/';
const ANALYTICS_SRC = '/_vercel/insights/script.js';
const LOCAL_ALLOWED = ['starlight-theme'];
const SESSION_ALLOWED = ['sl-sidebar-state'];
const ALL_PAGES = ['/', ...siteMapSlugs, PRIVACY];
const SECTIONS = [
	'Responsable',
	'Datos que tratamos',
	'Finalidad',
	'Base jurídica',
	'Destinatarios',
	'Conservación',
	'Derechos',
	'Cookies',
];

const privacyLink = `footer a[href="${PRIVACY}"]`;

// Visits every page and collects any Set-Cookie response header seen along the way.
async function visitAll(context: BrowserContext): Promise<string[]> {
	const setCookies: string[] = [];
	const page = await context.newPage();
	page.on('response', async (response) => {
		const header = await response.headerValue('set-cookie').catch(() => null);
		if (header) setCookies.push(`${response.url()}: ${header}`);
	});
	for (const path of ALL_PAGES) await page.goto(path);
	await page.close();
	return setCookies;
}

async function changeTheme(context: BrowserContext) {
	const page = await context.newPage();
	await page.goto(GUIDE);
	await page.locator('starlight-theme-select select').first().selectOption('dark', { force: true });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	return page;
}

test.describe('legal', () => {
	test('Scenario: Privacidad publicada con sus secciones', async ({ page }) => {
		const response = await page.goto(PRIVACY);
		expect(response?.status()).toBe(200);
		for (const name of SECTIONS) {
			await expect(page.getByRole('heading', { level: 2, name, exact: true }), name).toHaveCount(1);
		}
		await expectNoSevereViolations(page);
	});

	test('Scenario: Privacidad identifica al responsable', async ({ page }) => {
		await page.goto(PRIVACY);
		const heading = page.locator('h2#responsable');
		await expect(heading).toHaveText('Responsable');
		// The paragraph right after the "Responsable" heading names webdespega and links to its site.
		const first = page.locator('.sl-heading-wrapper:has(h2#responsable) + p, h2#responsable + p');
		await expect(first).toContainText('webdespega');
		await expect(first.locator(`a[href="${CREDIT_URL}"]`)).toHaveCount(1);
	});

	test('Scenario: Crédito en el pie', async ({ page }) => {
		await page.goto(GUIDE);
		const credit = page.locator(`footer a[href="${CREDIT_URL}"]`);
		await expect(credit).toHaveCount(1);
		await expect(credit).toHaveText('webdespega.com');
		await expect(credit).toHaveAttribute('target', '_blank');
		await expect(credit).toHaveAttribute('rel', 'noopener');
		await expect(page.locator(`a[href="${CREDIT_URL}"]`)).toHaveCount(1);
	});

	test('Scenario: Crédito sin nofollow', async ({ page }) => {
		await page.goto(GUIDE);
		const rel = (await page.locator(`footer a[href="${CREDIT_URL}"]`).getAttribute('rel')) ?? '';
		expect(rel).not.toMatch(/nofollow|sponsored/);
	});

	test('Scenario: Sin página de aviso legal', async ({ page }) => {
		const response = await page.goto('/legal/aviso-legal/');
		expect(response?.status()).toBe(404);
	});

	test('Scenario: Pie con enlace a privacidad en una guía', async ({ page }) => {
		await page.goto(GUIDE);
		await expect(page.locator(privacyLink)).toHaveCount(1);
	});

	test('Scenario: Pie con enlace a privacidad en la landing', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator(privacyLink)).toHaveCount(1);
	});

	test('Scenario: Pie con enlace a privacidad en la página 404', async ({ page }) => {
		const response = await page.goto('/ruta-inexistente/');
		expect(response?.status()).toBe(404);
		await expect(page.locator(privacyLink)).toHaveCount(1);
	});

	test('Scenario: Páginas legales fuera del sidebar', async ({ page }) => {
		await page.goto(GUIDE);
		await expect(page.locator('#starlight__sidebar a[href^="/legal/"]')).toHaveCount(0);
	});

	test('Scenario: Script de analítica en una página', async ({ request }) => {
		const html = await (await request.get(GUIDE)).text();
		const tags = html.match(/<script\b[^>]*>/g) ?? [];
		const analytics = tags.filter((tag) => tag.includes(`src="${ANALYTICS_SRC}"`));
		expect(analytics).toHaveLength(1);
		expect(analytics[0]).toMatch(/\sdefer[\s>=]/);
	});

	test('Scenario: Sin scripts externos', async ({ request, baseURL }) => {
		const origin = new URL(baseURL ?? 'http://localhost').origin;
		for (const path of ALL_PAGES) {
			const html = await (await request.get(path)).text();
			const sources = [...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
			for (const src of sources) expect(new URL(src, origin + path).origin, `${path}: ${src}`).toBe(origin);
		}
	});

	test('Scenario: Ninguna página establece cookies', async ({ browser }) => {
		const context = await browser.newContext();
		const setCookies = await visitAll(context);
		expect(setCookies).toEqual([]);
		expect(await context.cookies()).toEqual([]);
		await context.close();
	});

	test('Scenario: Cookies tras interactuar con búsqueda y tema', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto('/');
		await page.locator('site-search button[data-open-modal]').first().click();
		await page.locator('site-search .pagefind-ui__search-input').fill('OpenSpec');
		await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
		await (await changeTheme(context)).close();
		expect(await context.cookies()).toEqual([]);
		await context.close();
	});

	test('Scenario: Solo almacenamiento exento', async ({ browser }) => {
		const context = await browser.newContext();
		await visitAll(context);
		const page = await changeTheme(context);
		for (const path of ALL_PAGES) {
			await page.goto(path);
			const keys = await page.evaluate(async () => ({
				local: Object.keys(localStorage),
				session: Object.keys(sessionStorage),
				idb: (await indexedDB.databases()).map((db) => db.name),
			}));
			expect(keys.local.filter((k) => !LOCAL_ALLOWED.includes(k)), path).toEqual([]);
			expect(keys.session.filter((k) => !SESSION_ALLOWED.includes(k)), path).toEqual([]);
			expect(keys.idb, path).toEqual([]);
		}
		await context.close();
	});

	test('Scenario: Sin banner de cookies', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto('/');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page.getByText(/aceptar?\s.*cookies|accept\s.*cookies/i)).toHaveCount(0);
		await context.close();
	});
});
