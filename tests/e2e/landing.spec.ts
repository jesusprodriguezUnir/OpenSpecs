import { expect, test, type Page } from '@playwright/test';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

const HERO = '.hero';
const PRIMARY = '/empieza/primer-cambio/';
const SECONDARY = '/empieza/que-es/';
const JOURNEYS = [
	{ name: 'Equipo', href: '/equipo/adopcion/' },
	{ name: 'Inicio', href: '/empieza/que-es/' },
	{ name: 'Consulta', href: '/referencia/cli/' },
];
const STEPS = ['explore', 'propose', 'apply', 'archive'];

const journeyCard = (page: Page, name: string) =>
	page.locator('main .recorrido').filter({ has: page.locator('.name', { hasText: new RegExp(`^${name}`) }) });

const cycleItems = (page: Page) => page.locator('main ol[aria-label]').locator('li');

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page.$$eval('script', (nodes) =>
		nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
	).then(executableScripts);

test.describe('landing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Scenario: CTA primario al primer cambio', async ({ page }) => {
		const cta = page.locator(`${HERO} a[href="${PRIMARY}"]`);
		await expect(cta).toHaveCount(1);
		await expect(cta).toHaveAccessibleName(/30 minutos/);
		await expect(page.locator(`${HERO} h1`)).not.toBeEmpty();
	});

	test('Scenario: CTA secundario a qué es OpenSpec', async ({ page }) => {
		const hrefs = await page.locator(`${HERO} a`).evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs).toContain(SECONDARY);
		expect(hrefs.indexOf(PRIMARY)).toBeLessThan(hrefs.indexOf(SECONDARY));
	});

	test('Scenario: Destinos de los CTA existen', async ({ page }) => {
		for (const href of [PRIMARY, SECONDARY]) {
			const response = await page.goto(href);
			expect(response?.status(), href).toBe(200);
		}
	});

	test('Scenario: Tres frases bajo el encabezado', async ({ page }) => {
		const heading = page.locator('main h2', { hasText: 'OpenSpec' }).first();
		await expect(heading).toBeVisible();
		const items = await heading.evaluate((h) => {
			const anchor: Element = h.parentElement?.classList.contains('sl-heading-wrapper') ? h.parentElement : h;
			const next = anchor.nextElementSibling;
			if (next?.tagName !== 'OL') return [];
			return [...next.querySelectorAll(':scope > li')].map((li) => li.textContent ?? '');
		});
		expect(items).toHaveLength(3);
		for (const item of items) {
			expect(item.trim().split(/(?<=[.?!])\s+/).filter(Boolean)).toHaveLength(1);
		}
	});

	test('Scenario: Cuatro pasos en orden', async ({ page }) => {
		const list = page.locator('main ol[aria-label]');
		await expect(list).toHaveCount(1);
		await expect(list).toHaveAccessibleName(/\S/);
		const items = cycleItems(page);
		await expect(items).toHaveCount(4);
		const texts = await items.allTextContents();
		STEPS.forEach((step, i) => expect(texts[i]).toContain(step));
	});

	test('Scenario: Cada paso tiene descripción', async ({ page }) => {
		const items = cycleItems(page);
		for (let i = 0; i < STEPS.length; i++) {
			const desc = (await items.nth(i).locator('.desc').textContent())?.trim() ?? '';
			expect(desc, STEPS[i]).not.toBe('');
		}
	});

	test('Scenario: Recorridos con su destino', async ({ page }) => {
		const hrefs = await page.locator('main .recorrido').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs).toEqual(JOURNEYS.map((j) => j.href));
		for (const { name, href } of JOURNEYS) {
			await expect(journeyCard(page, name), name).toHaveAttribute('href', href);
		}
	});

	test('Scenario: Equipo marcado como recomendado', async ({ page }) => {
		await expect(journeyCard(page, 'Equipo')).toContainText(/recomendado/i);
	});

	test('Scenario: Consulta menciona la búsqueda', async ({ page }) => {
		await expect(journeyCard(page, 'Consulta')).toContainText(/búsqueda|buscador/i);
	});

	test('Scenario: Terminal oculta a tecnologías de apoyo', async ({ page }) => {
		const terminal = page.locator(`${HERO} [aria-hidden="true"]`).filter({ hasText: 'openspec init' });
		await expect(terminal).toHaveCount(1);
		await expect(terminal).toContainText('/opsx:archive');
	});

	test('Scenario: Terminal visible con JavaScript desactivado', async ({ browser, baseURL }) => {
		const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
		const page = await context.newPage();
		await page.goto('/');
		const terminal = page.locator(`${HERO} [aria-hidden="true"]`).filter({ hasText: 'openspec init' });
		await expect(terminal).toBeVisible();
		await expect(terminal).toContainText('/opsx:apply');
		await context.close();
	});

	test('Scenario: Sin animaciones con prefers-reduced-motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		const running = await page.evaluate(
			() =>
				document
					.getAnimations()
					.filter((a) => (a.effect as KeyframeEffect).target?.closest('.terminal, .ciclo-pasos')).length,
		);
		expect(running).toBe(0);
		const lines = page.locator(`${HERO} .terminal .line`);
		await expect(lines).toHaveCount(8);
		for (let i = 0; i < 8; i++) {
			await expect(lines.nth(i)).toHaveCSS('opacity', '1');
		}
	});

	test('Scenario: Fuentes servidas desde el propio sitio', async ({ page, baseURL }) => {
		const fonts: string[] = [];
		page.on('request', (r) => {
			if (r.resourceType() === 'font') fonts.push(r.url());
		});
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		expect(fonts.length).toBeGreaterThan(0);
		const origin = new URL(baseURL ?? '').origin;
		for (const url of fonts) expect(new URL(url).origin, url).toBe(origin);
	});

	test('Scenario: Sin Google Fonts', async ({ page }) => {
		const urls: string[] = [];
		page.on('request', (r) => urls.push(r.url()));
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const html = await page.content();
		for (const host of ['fonts.googleapis.com', 'fonts.gstatic.com']) {
			expect(html).not.toContain(host);
			expect(urls.filter((u) => u.includes(host))).toEqual([]);
		}
	});

	test('Scenario: Mismos scripts que una guía', async ({ page }) => {
		const landing = await scriptsOf(page);
		await page.goto('/empieza/que-es/');
		const guide = await scriptsOf(page);
		expect(scriptExtras(landing, guide)).toEqual([]);
	});
});
