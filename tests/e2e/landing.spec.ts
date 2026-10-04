import { expect, test, type Page } from '@playwright/test';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

const HERO = '.hero';
const PRIMARY = '/empieza/primer-cambio/';
const SECONDARY = '/empieza/que-es/';
const JOURNEYS = [
	{ name: 'Inicio', href: '/empieza/que-es/' },
	{ name: 'Equipo', href: '/equipo/adopcion/' },
	{ name: 'Consulta', href: '/referencia/cli/' },
];

const journeyCard = (page: Page, name: string) =>
	page.locator('main .sl-link-card').filter({ has: page.locator('.title', { hasText: new RegExp(`^${name}$`) }) });

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
		const text = await heading.evaluate((h) => {
			const anchor: Element = h.parentElement?.classList.contains('sl-heading-wrapper') ? h.parentElement : h;
			const next = anchor.nextElementSibling;
			return next?.tagName === 'P' ? next.textContent ?? '' : '';
		});
		const sentences = text.trim().split(/(?<=[.?!])\s+/).filter(Boolean);
		expect(sentences).toHaveLength(3);
	});

	test('Scenario: Diagrama con nombre accesible', async ({ page }) => {
		const svg = page.locator('main svg[role="img"]');
		await expect(svg).toHaveCount(1);
		const title = (await svg.locator('title').textContent())?.trim() ?? '';
		expect(title).not.toBe('');
		await expect(svg).toHaveAccessibleName(title);
	});

	test('Scenario: Texto alternativo con los cuatro pasos en orden', async ({ page }) => {
		const desc = (await page.locator('main svg[role="img"] desc').textContent()) ?? '';
		const positions = ['explore', 'propose', 'apply', 'archive'].map((step) => desc.indexOf(step));
		expect(positions.every((p) => p >= 0)).toBe(true);
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
	});

	test('Scenario: Diagrama sin imagen externa', async ({ page }) => {
		await expect(page.locator('main svg[role="img"] title')).toHaveCount(1);
		await expect(page.locator('main img')).toHaveCount(0);
	});

	test('Scenario: Recorridos con su destino', async ({ page }) => {
		for (const { name, href } of JOURNEYS) {
			await expect(journeyCard(page, name).locator('a'), name).toHaveAttribute('href', href);
		}
	});

	test('Scenario: Consulta menciona la búsqueda', async ({ page }) => {
		await expect(journeyCard(page, 'Consulta')).toContainText(/búsqueda|buscador/i);
	});

	test('Scenario: Mismos scripts que una guía', async ({ page }) => {
		const landing = await scriptsOf(page);
		await page.goto('/empieza/que-es/');
		const guide = await scriptsOf(page);
		expect(scriptExtras(landing, guide)).toEqual([]);
	});
});
