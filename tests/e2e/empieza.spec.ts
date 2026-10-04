import { expect, test } from '@playwright/test';

const SIDEBAR = '#starlight__sidebar';
const EMPIEZA = [
	'/empieza/que-es/',
	'/empieza/conceptos/',
	'/empieza/instalacion/',
	'/empieza/primer-cambio/',
];
const NEXT_STEP = [...EMPIEZA.slice(1), '/guias/formato-de-specs/'];

// Link inside the "Siguiente paso" section, skipping Starlight's heading anchor.
const nextStepLink = (page: import('@playwright/test').Page) =>
	page.locator(
		'xpath=//main//h2[@id="siguiente-paso"]/following::a[not(contains(@class,"sl-anchor-link"))][1]',
	);

test.describe('empieza', () => {
	test('Scenario: Empieza sin marcadores de preparación', async ({ page }) => {
		for (const slug of EMPIEZA) {
			await page.goto(slug);
			await expect(page.locator('main'), slug).not.toContainText('Página en preparación');
		}
	});

	test('Scenario: Orden de las páginas de Empieza', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		const links = page
			.locator(`${SIDEBAR} ul.top-level > li > details`)
			.filter({ has: page.locator('summary .group-label', { hasText: /^Empieza$/ }) })
			.locator('a');
		await expect(links).toHaveCount(EMPIEZA.length);
		const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
		expect(hrefs).toEqual(EMPIEZA);
	});

	test('Scenario: Cadena de Siguiente paso', async ({ page }) => {
		for (const [i, slug] of EMPIEZA.entries()) {
			await page.goto(slug);
			await expect(nextStepLink(page), slug).toHaveAttribute('href', NEXT_STEP[i]);
		}
	});

	test('Scenario: Primer cambio enlaza a Escribir specs', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const link = nextStepLink(page);
		await expect(link).toHaveAttribute('href', '/guias/formato-de-specs/');
		const response = await page.request.get('/guias/formato-de-specs/');
		expect(response.status()).toBe(200);
	});

	test('Scenario: Pestañas de shell en instalación', async ({ page }) => {
		await page.goto('/empieza/instalacion/');
		const group = page.locator('starlight-tabs').first();
		await expect(group.getByRole('tab', { name: 'PowerShell' })).toHaveCount(1);
		await expect(group.getByRole('tab', { name: 'bash' })).toHaveCount(1);
	});

	test('Scenario: Pestañas sincronizadas', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const groups = page.locator('starlight-tabs');
		const total = await groups.count();
		expect(total).toBeGreaterThan(1);
		await groups.first().getByRole('tab', { name: 'bash' }).click();
		for (let i = 0; i < total; i++) {
			await expect(groups.nth(i).getByRole('tab', { name: 'bash' })).toHaveAttribute(
				'aria-selected',
				'true',
			);
		}
	});

	test('Scenario: Duración declarada del tutorial', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const text = await page.locator('[data-guide-meta] [data-meta="duration"] dd').innerText();
		const minutes = Number(text.match(/\d+/)?.[0]);
		expect(minutes).toBeGreaterThanOrEqual(1);
		expect(minutes).toBeLessThanOrEqual(30);
	});
});
