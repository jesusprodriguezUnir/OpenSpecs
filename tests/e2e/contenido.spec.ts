import { readdirSync, readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { chatReference, undocumentedCommands } from './opsx-commands';

// The E2E build runs with BUILD_DATE far in the future (playwright.config.ts), so every guide page
// is stale. Expected lastReviewed labels are read from each page's frontmatter, not hardcoded.
const HEADER = '[data-guide-meta]';

function lastReviewedLabel(file: string): string {
	const source = readFileSync(new URL(`../../src/content/docs/${file}`, import.meta.url), 'utf8');
	const match = source.match(/^lastReviewed:\s*(\S+)\s*$/m);
	if (!match) throw new Error(`${file} has no lastReviewed in its frontmatter`);
	return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(match[1]));
}

test.describe('contenido', () => {
	test('Scenario: Cabecera completa en una guía', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const header = page.locator(HEADER);
		await expect(header).toHaveCount(1);
		await expect(header.locator('[data-meta="level"] dd')).toHaveText('Inicio');
		await expect(header.locator('[data-meta="duration"] dd')).toHaveText('30 min');
		await expect(header.locator('[data-meta="openspec-version"] dd')).toHaveText('1.14.0');
		await expect(header.locator('[data-meta="last-reviewed"] dd')).toHaveText(
			lastReviewedLabel('empieza/primer-cambio.mdx'),
		);
	});

	test('Scenario: Guía sin duración', async ({ page }) => {
		await page.goto('/guias/recetas/');
		const header = page.locator(HEADER);
		await expect(header.locator('[data-meta="level"] dd')).toHaveText('Intermedio');
		await expect(header.locator('[data-meta="openspec-version"] dd')).toHaveText('1.14.0');
		await expect(header.locator('[data-meta="last-reviewed"] dd')).toHaveText(lastReviewedLabel('guias/recetas.mdx'));
		await expect(header.locator('[data-meta="duration"]')).toHaveCount(0);
		await expect(header).not.toContainText('min');
	});

	test('Scenario: Página fuera de guías sin cabecera', async ({ page }) => {
		await page.goto('/recursos/');
		await expect(page.locator('h1')).not.toBeEmpty();
		await expect(page.locator(HEADER)).toHaveCount(0);
		await expect(page.locator('[data-stale-warning]')).toHaveCount(0);
	});

	test('Scenario: Página revisada hace más de 180 días', async ({ page }) => {
		await page.goto('/guias/flujo-opsx/');
		const warning = page.locator('[data-stale-warning]');
		await expect(warning).toHaveCount(1);
		await expect(warning).toContainText('Contenido posiblemente desactualizado');
	});
});

test.describe('contenido: cabecera como lista de descripción', () => {
	test('Scenario: Cada dato con su término', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const header = page.locator(HEADER);
		await expect(header).toHaveJSProperty('tagName', 'DL');
		const pairs = await header.locator(':scope > div').evaluateAll((divs) =>
			divs.map((d) => ({
				term: d.querySelector(':scope > dt')?.textContent?.trim() ?? '',
				value: d.querySelector(':scope > dt + dd')?.textContent?.trim() ?? '',
			})),
		);
		expect(pairs.map((p) => p.term)).toEqual(['Nivel', 'Duración', 'OpenSpec', 'Revisado']);
		for (const p of pairs) expect(p.value, p.term).not.toBe('');
	});
});

const BOX = 'Comandos de esta página';
const DOCS = new URL('../../src/content/docs/', import.meta.url);

type DeclaredCommands = { page: string; file: string; commands: string[] };

/** Pages whose frontmatter declares `commands`, read from the source files. */
function declaredCommands(): DeclaredCommands[] {
	const result: DeclaredCommands[] = [];
	for (const file of readdirSync(DOCS, { recursive: true }).map(String)) {
		if (!/\.mdx?$/.test(file)) continue;
		const path = file.split('\\').join('/');
		const source = readFileSync(new URL(path, DOCS), 'utf8');
		const match = source.match(/^commands:\s*(\[.*\])\s*$/m);
		if (!match) continue;
		const slug = path.replace(/(\/index)?\.mdx?$/, '');
		result.push({ page: `/${slug}/`, file, commands: JSON.parse(match[1]) as string[] });
	}
	return result;
}

/** «page: command» for every declared command that does not appear in that page's body text. */
function commandsMissingFromBody(pages: readonly { page: string; commands: string[]; body: string }[]): string[] {
	return pages.flatMap(({ page, commands, body }) => commands.filter((c) => !body.includes(c)).map((c) => `${page}: ${c}`));
}

const bodyText = async (page: Page, href: string) => {
	await page.goto(href);
	return (await page.locator('main .sl-markdown-content').textContent()) ?? '';
};

test.describe('contenido: comandos de la página', () => {
	test('Scenario: Caja con los comandos declarados', async ({ page }) => {
		const declared = declaredCommands();
		expect(declared.length).toBeGreaterThan(0);
		for (const { page: href, commands } of declared) {
			await page.goto(href);
			const box = page.getByRole('complementary', { name: BOX });
			await expect(box, href).toHaveCount(1);
			await expect(box.locator('li code'), href).toHaveText(commands);
			await expect(box.locator('a[href="/referencia/comandos-chat/"]'), href).toHaveCount(1);
		}
	});

	test('Scenario: Página sin commands', async ({ page }) => {
		const declared = declaredCommands().map((d) => d.page);
		expect(declared).not.toContain('/guias/brownfield/');
		await page.goto('/guias/brownfield/');
		await expect(page.locator('h1')).not.toBeEmpty();
		await expect(page.locator('[data-page-commands]')).toHaveCount(0);
	});

	test('Scenario: Caja visible en escritorio y en móvil', async ({ page }) => {
		for (const width of [1440, 360]) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto('/guias/flujo-opsx/');
			const box = page.getByRole('complementary', { name: BOX });
			await expect(box, `${width}px`).toHaveCount(1);
			await expect(box, `${width}px`).toBeVisible();
		}
	});

	test('Scenario: Comandos declarados documentados', async ({ page }) => {
		const names = [...new Set(declaredCommands().flatMap((d) => d.commands))].join(' ');
		expect(names).toMatch(/\/opsx:/);
		expect(undocumentedCommands(names, await chatReference(page))).toEqual([]);
	});

	test('Scenario: Comando declarado ausente del cuerpo', async ({ page }) => {
		const pages = [];
		for (const d of declaredCommands()) pages.push({ ...d, body: await bodyText(page, d.page) });
		expect(commandsMissingFromBody(pages)).toEqual([]);
		const synthetic = [{ page: '/guias/ejemplo/', commands: ['/opsx:propose', '/opsx:verify'], body: 'Usa /opsx:propose.' }];
		expect(commandsMissingFromBody(synthetic)).toEqual(['/guias/ejemplo/: /opsx:verify']);
	});
});
