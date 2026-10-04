import { expect, test } from '@playwright/test';

const SIDEBAR = '#starlight__sidebar';
const AGENTES = ['/agentes/claude-code/', '/agentes/otros/'];
const EQUIPO = ['/equipo/jira/', '/equipo/azure-devops/', '/equipo/ci/', '/equipo/adopcion/'];
const PAGES = [...AGENTES, ...EQUIPO];
const NEXT_STEP = [...PAGES.slice(1), '/referencia/comandos-chat/'];
const RGPD_PAGES = ['/equipo/jira/', '/equipo/azure-devops/', '/equipo/adopcion/'];

// Link inside the "Siguiente paso" section, skipping Starlight's heading anchor.
const nextStepLink = (page: import('@playwright/test').Page) =>
	page.locator(
		'xpath=//main//h2[@id="siguiente-paso"]/following::a[not(contains(@class,"sl-anchor-link"))][1]',
	);

const groupHrefs = async (page: import('@playwright/test').Page, label: RegExp) =>
	page
		.locator(`${SIDEBAR} ul.top-level > li > details`)
		.filter({ has: page.locator('summary .group-label', { hasText: label }) })
		.locator('a')
		.evaluateAll((els) => els.map((el) => el.getAttribute('href')));

test.describe('agentes y equipo', () => {
	test('Scenario: Agentes y equipo sin marcadores de preparación', async ({ page }) => {
		for (const slug of PAGES) {
			await page.goto(slug);
			await expect(page.locator('main'), slug).not.toContainText('Página en preparación');
		}
	});

	test('Scenario: Orden de las páginas de Con tu agente', async ({ page }) => {
		await page.goto('/agentes/claude-code/');
		expect(await groupHrefs(page, /^Con tu agente$/)).toEqual(AGENTES);
	});

	test('Scenario: Orden de las páginas de En equipo', async ({ page }) => {
		await page.goto('/equipo/jira/');
		expect(await groupHrefs(page, /^En equipo$/)).toEqual(EQUIPO);
	});

	test('Scenario: Cadena de Siguiente paso en agentes y equipo', async ({ page }) => {
		for (const [i, slug] of PAGES.entries()) {
			await page.goto(slug);
			await expect(nextStepLink(page), slug).toHaveAttribute('href', NEXT_STEP[i]);
		}
	});

	test('Scenario: Adopción enlaza a comandos de chat', async ({ page }) => {
		await page.goto('/equipo/adopcion/');
		await expect(nextStepLink(page)).toHaveAttribute('href', '/referencia/comandos-chat/');
		const response = await page.request.get('/referencia/comandos-chat/');
		expect(response.status()).toBe(200);
	});

	test('Scenario: Aviso de RGPD en las páginas de equipo', async ({ page }) => {
		for (const slug of RGPD_PAGES) {
			await page.goto(slug);
			await expect(
				page.locator('main .starlight-aside').filter({ hasText: 'RGPD' }).first(),
				slug,
			).toBeVisible();
		}
	});

	test('Scenario: Claude Code enlaza a plantillas', async ({ page }) => {
		await page.goto('/agentes/claude-code/');
		expect(await page.locator('main a[href="/referencia/plantillas/"]').count()).toBeGreaterThan(0);
	});

	test('Scenario: Pestañas de plataforma en CI', async ({ page }) => {
		await page.goto('/equipo/ci/');
		const group = page.locator('starlight-tabs').first();
		await expect(group.getByRole('tab', { name: 'Azure Pipelines' })).toHaveCount(1);
		await expect(group.getByRole('tab', { name: 'GitHub Actions' })).toHaveCount(1);
	});

	test('Scenario: Versión de OpenSpec fijada en CI', async ({ page }) => {
		await page.goto('/equipo/ci/');
		const code = (await page.locator('main pre').allTextContents()).join('\n');
		expect(code).toMatch(/@fission-ai\/openspec@\d+\.\d+\.\d+/);
		expect(code).not.toContain('@latest');
	});
});
