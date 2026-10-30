import { expect, test, type Page } from '@playwright/test';
import { invalidSkillVerdicts } from '../../src/lib/content-rules';

const SIDEBAR = '#starlight__sidebar';
const AGENTES = ['/agentes/claude-code/', '/agentes/otros/', '/agentes/skills/'];
const EQUIPO = ['/equipo/jira/', '/equipo/azure-devops/', '/equipo/ci/', '/equipo/gobierno/', '/equipo/adopcion/'];
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

	test('Scenario: Checklist antes de abrir la PR', async ({ page }) => {
		await page.goto('/equipo/adopcion/');
		await expect(page.locator('main h2', { hasText: 'Antes de abrir la PR' })).toHaveCount(1);
		const list = page.locator(
			'xpath=//main//h2[normalize-space()="Antes de abrir la PR"]/following::ul[1]',
		);
		expect(await list.locator('li input[type="checkbox"]').count()).toBeGreaterThan(3);
	});
});

// Rows of the first table that follows the h2 with the given text, as { header: cell } records.
async function tableAfter(page: Page, heading: string): Promise<Record<string, string>[]> {
	const table = page.locator(`xpath=//main//h2[normalize-space()="${heading}"]/following::table[1]`);
	const headers = (await table.locator('thead th').allTextContents()).map((h) => h.trim());
	const rows = await table.locator('tbody tr').all();
	return Promise.all(
		rows.map(async (row) => {
			const cells = (await row.locator('td').allTextContents()).map((c) => c.trim());
			return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
		}),
	);
}

test.describe('gobierno del cambio', () => {
	test('Scenario: Espectro de autoridad', async ({ page }) => {
		await page.goto('/equipo/gobierno/');
		const models = (await tableAfter(page, 'Espectro de autoridad de la spec')).map((r) => r['Modelo']);
		expect(models).toEqual(['Spec-first', 'Spec-anchored', 'Spec-as-source']);
	});

	test('Scenario: Carencias de OpenSpec con su cobertura', async ({ page }) => {
		await page.goto('/equipo/gobierno/');
		const rows = await tableAfter(page, 'Lo que OpenSpec deja fuera');
		expect(rows.length).toBeGreaterThan(0);
		expect(Object.keys(rows[0])).toEqual(['Carencia', 'Cómo cubrirla']);
		for (const row of rows) expect(row['Cómo cubrirla']).not.toBe('');
	});

	test('Scenario: Verja diferenciada del hook', async ({ page }) => {
		await page.goto('/equipo/gobierno/');
		await expect(page.locator('main h2', { hasText: 'Detección temprana frente a verja' })).toHaveCount(1);
	});

	test('Scenario: Términos enlazados al glosario', async ({ page }) => {
		await page.goto('/equipo/gobierno/');
		for (const id of ['spec-anchored', 'verja']) {
			expect(await page.locator(`main a[href="/referencia/glosario/#${id}"]`).count(), id).toBeGreaterThan(0);
		}
		await page.goto('/referencia/glosario/');
		for (const id of ['spec-anchored', 'verja']) await expect(page.locator(`main [id="${id}"]`)).toHaveCount(1);
	});
});

test.describe('skills complementarias', () => {
	test('Scenario: Tabla de mapeo con veredicto', async ({ page }) => {
		await page.goto('/agentes/skills/');
		const rows = await tableAfter(page, 'Qué usar en cada fase');
		expect(rows.length).toBeGreaterThan(0);
		for (const column of ['Fase', 'Skill', 'Veredicto']) expect(Object.keys(rows[0])).toContain(column);
		expect(invalidSkillVerdicts(rows.map((r) => ({ skill: r['Skill'], verdict: r['Veredicto'] })))).toEqual([]);
	});

	test('Scenario: Aviso de cadena de suministro', async ({ page }) => {
		await page.goto('/agentes/skills/');
		await expect(page.locator('main .starlight-aside').filter({ hasText: 'cadena de suministro' }).first()).toBeVisible();
	});

	test('Scenario: Skills solapadas marcadas como No usar', async ({ page }) => {
		await page.goto('/agentes/skills/');
		const rows = await tableAfter(page, 'Qué usar en cada fase');
		for (const skill of ['to-spec', 'to-tickets']) {
			expect(rows.find((r) => r['Skill'] === skill)?.['Veredicto'], skill).toBe('No usar');
		}
	});

	test('Scenario: Skills enlaza a Jira', async ({ page }) => {
		await page.goto('/agentes/skills/');
		await expect(nextStepLink(page)).toHaveAttribute('href', '/equipo/jira/');
	});
});

test.describe('contenido incorporado de la base de conocimiento', () => {
	test('Scenario: Tests en rojo en la DoD', async ({ page }) => {
		await page.goto('/equipo/adopcion/');
		const items = await page
			.locator('xpath=//main//h2[normalize-space()="Definition of Done"]/following::ul[1]/li')
			.allTextContents();
		expect(items.some((t) => /en rojo antes de implementar/.test(t))).toBe(true);
	});

	test('Scenario: Riesgos nuevos en adopción', async ({ page }) => {
		await page.goto('/equipo/adopcion/');
		const risks = (await tableAfter(page, 'Riesgos y mitigaciones')).map((r) => r['Riesgo']).join('\n');
		expect(risks).toMatch(/«Válido» confundido con «correcto»/);
		expect(risks).toMatch(/ajusta los tests/);
		expect(risks).toMatch(/se actualizan solas/);
	});

	test('Scenario: Preguntas de gobierno en la FAQ', async ({ page }) => {
		await page.goto('/referencia/faq/');
		for (const question of ['Si openspec validate pasa, ¿la spec es correcta?', '¿El hook Stop sustituye a la pipeline?']) {
			const heading = page.locator('main h3').filter({ hasText: question });
			await expect(heading, question).toHaveCount(1);
			const answer = page.locator(
				`xpath=//main//h3[normalize-space()="${question}"]/following::p[1]`,
			);
			await expect(answer.locator('a[href="/equipo/gobierno/"]'), question).toHaveCount(1);
		}
	});
});
