import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

const REFERENCIA = [
	'/referencia/comandos-chat/',
	'/referencia/cli/',
	'/referencia/plantillas/',
	'/referencia/glosario/',
	'/referencia/faq/',
];
const NEXT_STEP = [...REFERENCIA.slice(1), '/recursos/'];

const fixture = JSON.parse(readFileSync('tests/fixtures/openspec-cli-1.14.0.json', 'utf8')) as {
	commands: Record<string, unknown>;
};

type ResourceEntry = { title: string; url: string; type: string };

// Minimal reader for src/data/resources.yaml (flat entries, one "key: value" per line).
const resources: ResourceEntry[] = readFileSync('src/data/resources.yaml', 'utf8')
	.split(/^- /m)
	.slice(1)
	.map((block) => {
		const field = (key: string) =>
			(block.match(new RegExp(`^\\s*${key}: (.+)$`, 'm'))?.[1] ?? '').trim().replace(/^"(.*)"$/, '$1');
		return { title: field('title'), url: field('url'), type: field('type') };
	});

// Link inside the "Siguiente paso" section, skipping Starlight's heading anchor.
const nextStepLink = (page: Page) =>
	page.locator(
		'xpath=//main//h2[@id="siguiente-paso"]/following::a[not(contains(@class,"sl-anchor-link"))][1]',
	);

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page
		.$$eval('script', (nodes) =>
			nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
		)
		.then(executableScripts);

const resourceItems = (page: Page) => page.locator('.resources li[data-type]');

test.describe('referencia', () => {
	test('Scenario: Referencia sin marcadores de preparación', async ({ page }) => {
		for (const slug of REFERENCIA) {
			await page.goto(slug);
			await expect(page.locator('main'), slug).not.toContainText('Página en preparación');
		}
	});

	test('Scenario: Cadena de Siguiente paso en Referencia', async ({ page }) => {
		for (const [i, slug] of REFERENCIA.entries()) {
			await page.goto(slug);
			await expect(nextStepLink(page), slug).toHaveAttribute('href', NEXT_STEP[i]);
			expect((await page.request.get(NEXT_STEP[i])).status(), NEXT_STEP[i]).toBe(200);
		}
	});

	test('Scenario: FAQ enlaza a Recursos', async ({ page }) => {
		await page.goto('/referencia/faq/');
		await expect(nextStepLink(page)).toHaveAttribute('href', '/recursos/');
		expect((await page.request.get('/recursos/')).status()).toBe(200);
	});

	test('Scenario: Ancla de delta spec', async ({ page }) => {
		await page.goto('/referencia/glosario/#delta-spec');
		const heading = page.locator('main h3#delta-spec');
		await expect(heading).toHaveCount(1);
		await expect(heading).toHaveText('Delta spec');
	});

	test('Scenario: Anclas únicas en el glosario', async ({ page }) => {
		await page.goto('/referencia/glosario/');
		const ids = await page.locator('main h3[id]').evaluateAll((els) => els.map((el) => el.id));
		expect(ids.length).toBeGreaterThan(0);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
	});

	test('Scenario: Comandos principales documentados', async ({ page }) => {
		await page.goto('/referencia/cli/');
		const code = (await page.locator('main code').allTextContents()).join('\n');
		const missing = Object.keys(fixture.commands)
			.filter((name) => !name.includes(' ') && name !== 'help')
			.filter((name) => !new RegExp(`openspec ${name}(?![\\w-])`).test(code));
		expect(missing).toEqual([]);
	});
});

test.describe('recursos', () => {
	test('Scenario: Todos los recursos listados', async ({ page }) => {
		await page.goto('/recursos/');
		expect(resources.length).toBeGreaterThan(0);
		await expect(resourceItems(page)).toHaveCount(resources.length);
		for (const { title, url } of resources) {
			const link = page.locator(`.resources li a[href="${url}"]`);
			await expect(link, url).toHaveCount(1);
			await expect(link, url).toHaveText(title);
			await expect(link, url).toHaveAttribute('rel', /noopener/);
		}
	});

	test('Scenario: Tipo e idioma visibles', async ({ page }) => {
		await page.goto('/recursos/');
		const items = await resourceItems(page).all();
		expect(items.length).toBe(resources.length);
		for (const item of items) {
			await expect(item.locator('.resource-type')).toHaveText(/^(Oficial|Comunidad|Vídeo)$/);
			await expect(item.locator('.resource-lang')).toHaveText(/^(Español|Inglés)$/);
		}
	});

	test('Scenario: Todos por defecto', async ({ page }) => {
		await page.goto('/recursos/');
		await expect(page.getByRole('group', { name: 'Filtrar por tipo' })).toBeVisible();
		await expect(page.getByRole('radio', { name: 'Todos' })).toBeChecked();
		for (const item of await resourceItems(page).all()) await expect(item).toBeVisible();
	});

	test('Scenario: Filtro con teclado', async ({ page }) => {
		await page.goto('/recursos/');
		for (let i = 0; i < 100; i++) {
			await page.keyboard.press('Tab');
			if (await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name === 'resource-type')) break;
		}
		await expect(page.getByRole('radio', { name: 'Todos' })).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(page.getByRole('radio', { name: 'Oficial' })).toBeChecked();
		for (const item of await resourceItems(page).all()) {
			const type = await item.getAttribute('data-type');
			if (type === 'oficial') await expect(item).toBeVisible();
			else await expect(item).toBeHidden();
		}
	});

	test('Scenario: Recursos sin scripts extra', async ({ page }) => {
		await page.goto('/recursos/');
		const recursos = await scriptsOf(page);
		await page.goto('/empieza/que-es/');
		const guide = await scriptsOf(page);
		expect(scriptExtras(recursos, guide)).toEqual([]);
	});
});

test.describe('recursos sin JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('Scenario: Filtrar vídeos sin JavaScript', async ({ page }) => {
		await page.goto('/recursos/');
		const url = page.url();
		await page.getByRole('radio', { name: 'Vídeo' }).check();
		expect(page.url()).toBe(url);
		const videos = resources.filter((r) => r.type === 'video').length;
		expect(videos).toBeGreaterThan(0);
		await expect(page.locator('.resources li[data-type="video"]:visible')).toHaveCount(videos);
		await expect(page.locator('.resources li:not([data-type="video"]):visible')).toHaveCount(0);
	});
});

test.describe('busqueda', () => {
	const search = async (page: Page, term: string) => {
		await page.goto('/empieza/que-es/');
		await page.locator('site-search button[data-open-modal]').first().click();
		await page.locator('dialog input').first().fill(term);
	};

	test('Scenario: Buscar delta spec', async ({ page }) => {
		await search(page, 'delta spec');
		await expect(page.locator('dialog a[href="/referencia/glosario/#delta-spec"]').first()).toBeVisible();
	});

	test('Scenario: Término sin coincidencias', async ({ page }) => {
		await search(page, 'zzqxy');
		await expect(page.locator('dialog')).toContainText('Ningún resultado');
	});
});
