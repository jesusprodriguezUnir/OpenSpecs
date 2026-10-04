import { expect, test } from '@playwright/test';

const SIDEBAR = '#starlight__sidebar';
const GUIAS = [
	'/guias/formato-de-specs/',
	'/guias/flujo-opsx/',
	'/guias/recetas/',
	'/guias/brownfield/',
	'/guias/configuracion/',
];
const NEXT_STEP = [...GUIAS.slice(1), '/agentes/claude-code/'];

// Link inside the "Siguiente paso" section, skipping Starlight's heading anchor.
const nextStepLink = (page: import('@playwright/test').Page) =>
	page.locator(
		'xpath=//main//h2[@id="siguiente-paso"]/following::a[not(contains(@class,"sl-anchor-link"))][1]',
	);

const expectShellTabs = async (page: import('@playwright/test').Page, slug: string) => {
	await page.goto(slug);
	const group = page.locator('starlight-tabs').first();
	await expect(group.getByRole('tab', { name: 'PowerShell' })).toHaveCount(1);
	await expect(group.getByRole('tab', { name: 'bash' })).toHaveCount(1);
};

test.describe('guias', () => {
	test('Scenario: Guías sin marcadores de preparación', async ({ page }) => {
		for (const slug of GUIAS) {
			await page.goto(slug);
			await expect(page.locator('main'), slug).not.toContainText('Página en preparación');
		}
	});

	test('Scenario: Orden de las páginas de Guías', async ({ page }) => {
		await page.goto('/guias/formato-de-specs/');
		const links = page
			.locator(`${SIDEBAR} ul.top-level > li > details`)
			.filter({ has: page.locator('summary .group-label', { hasText: /^Guías$/ }) })
			.locator('a');
		await expect(links).toHaveCount(GUIAS.length);
		const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
		expect(hrefs).toEqual(GUIAS);
	});

	test('Scenario: Cadena de Siguiente paso en Guías', async ({ page }) => {
		for (const [i, slug] of GUIAS.entries()) {
			await page.goto(slug);
			await expect(nextStepLink(page), slug).toHaveAttribute('href', NEXT_STEP[i]);
		}
	});

	test('Scenario: Configuración enlaza a Claude Code', async ({ page }) => {
		await page.goto('/guias/configuracion/');
		await expect(nextStepLink(page)).toHaveAttribute('href', '/agentes/claude-code/');
		const response = await page.request.get('/agentes/claude-code/');
		expect(response.status()).toBe(200);
	});

	test('Scenario: Bloque con líneas insertadas', async ({ page }) => {
		await page.goto('/guias/formato-de-specs/');
		expect(await page.locator('main .ec-line.ins').count()).toBeGreaterThan(0);
	});

	test('Scenario: Bloque con líneas eliminadas', async ({ page }) => {
		await page.goto('/guias/formato-de-specs/');
		expect(await page.locator('main .ec-line.del').count()).toBeGreaterThan(0);
	});

	test('Scenario: Pestañas de shell en recetas', async ({ page }) => {
		await expectShellTabs(page, '/guias/recetas/');
	});

	test('Scenario: Pestañas de shell en configuración', async ({ page }) => {
		await expectShellTabs(page, '/guias/configuracion/');
	});
});
