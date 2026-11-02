import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { chatReference, undocumentedCommands } from './opsx-commands';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

const HERO = '.hero';
const PRIMARY = '/empieza/primer-cambio/';
const SECONDARY = '/empieza/que-es/';
const PDF = '/manual-openspec.pdf';
const JOURNEYS = [
	{ name: 'Inicio', href: '/empieza/que-es/' },
	{ name: 'Equipo', href: '/equipo/adopcion/' },
	{ name: 'Consulta', href: '/referencia/cli/' },
];
const STEPS = ['explore', 'propose', 'Revisión', 'apply', 'verify', 'archive'];
const DOCS_DIR = join(process.cwd(), 'src', 'content', 'docs');

const journeyCard = (page: Page, name: string) => page.locator(`main .recorrido[data-recorrido="${name}"]`);
const cycleItems = (page: Page) => page.locator('main ol.ciclo[aria-label] > li');
const figure = (page: Page) => page.locator(`${HERO} figure[data-delta-figura]`);
const sectionByHeading = (page: Page, heading: string) =>
	page.locator('main section').filter({ has: page.locator('h2', { hasText: heading }) });

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page.$$eval('script', (nodes) =>
		nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
	).then(executableScripts);

/** Same «X,X MB» label the build writes next to the PDF link (es-ES, one decimal). */
const pdfSizeLabel = (bytes: number) =>
	`${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} MB`;

/** Highest `openspecVersion` declared in the docs frontmatter, read from the source files. */
function highestDeclaredVersion(): string {
	const files: string[] = [];
	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			const path = join(dir, name);
			if (statSync(path).isDirectory()) walk(path);
			else if (/\.mdx?$/.test(name)) files.push(path);
		}
	};
	walk(DOCS_DIR);
	const versions = files
		.map((f) => readFileSync(f, 'utf8').match(/^openspecVersion:\s*["']?(\d+\.\d+(?:\.\d+)?)/m)?.[1])
		.filter((v): v is string => Boolean(v));
	const parse = (v: string) => v.split('.').map(Number);
	versions.sort((a, b) => {
		const [pa, pb] = [parse(a), parse(b)];
		for (let i = 0; i < 3; i++) {
			const d = (pa[i] ?? 0) - (pb[i] ?? 0);
			if (d) return d;
		}
		return 0;
	});
	return versions.at(-1) ?? '';
}

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

	test('Scenario: Enlace al manual PDF con su tamaño real', async ({ page, request }) => {
		const link = page.locator(`${HERO} a[href="${PDF}"]`);
		await expect(link).toHaveCount(1);
		const response = await request.get(PDF);
		expect(response.status()).toBe(200);
		const label = pdfSizeLabel((await response.body()).length);
		expect(label).toMatch(/^\d+,\d MB$/);
		await expect(link).toContainText(label);
	});

	test('Scenario: Versión de OpenSpec de referencia en el hero', async ({ page }) => {
		const version = highestDeclaredVersion();
		expect(version).not.toBe('');
		await expect(page.locator(`${HERO} [data-reference-version]`)).toHaveText(`OpenSpec ${version}`);
	});

	test('Scenario: Recorridos con su destino', async ({ page }) => {
		await expect(page.locator('main h2', { hasText: '¿Desde dónde partes?' })).toHaveCount(1);
		const cards = await page
			.locator('main .recorrido')
			.evaluateAll((as) => as.map((a) => ({ name: a.getAttribute('data-recorrido'), href: a.getAttribute('href') })));
		expect(cards).toEqual(JOURNEYS);
		for (const { name } of JOURNEYS) {
			await expect(journeyCard(page, name).locator('.name')).toHaveText(name);
		}
	});

	test('Scenario: Equipo marcado como recomendado', async ({ page }) => {
		await expect(journeyCard(page, 'Equipo')).toContainText(/recomendado/i);
	});

	test('Scenario: Consulta menciona la búsqueda', async ({ page }) => {
		await expect(journeyCard(page, 'Consulta')).toContainText(/búsqueda|buscador/i);
	});

	test('Scenario: Número de páginas coherente con el sidebar', async ({ page }) => {
		const cards = await page.locator('main .recorrido').evaluateAll((as) =>
			as.map((a) => ({
				href: a.getAttribute('href') ?? '',
				pages: Number(a.querySelector('[data-section-pages]')?.getAttribute('data-section-pages')),
				text: a.querySelector('[data-section-pages]')?.textContent ?? '',
			})),
		);
		expect(cards).toHaveLength(JOURNEYS.length);
		for (const card of cards) {
			expect(card.text, card.href).toContain(`${card.pages} página`);
			await page.goto(card.href);
			const links = await page
				.locator('#starlight__sidebar a[aria-current="page"]')
				.evaluate((a) => a.closest('ul.top-level > li')?.querySelectorAll('a[href]').length ?? 0);
			expect(card.pages, card.href).toBe(links);
		}
	});

	test('Scenario: Seis pasos en orden', async ({ page }) => {
		await expect(page.locator('main h2', { hasText: 'El ciclo de un change' })).toHaveCount(1);
		const list = page.locator('main ol.ciclo[aria-label]');
		await expect(list).toHaveCount(1);
		await expect(list).toHaveAccessibleName(/\S/);
		const items = cycleItems(page);
		await expect(items).toHaveCount(STEPS.length);
		const texts = await items.allTextContents();
		STEPS.forEach((step, i) => expect(texts[i]).toContain(step));
	});

	test('Scenario: Cada paso tiene descripción', async ({ page }) => {
		const items = cycleItems(page);
		await expect(items).toHaveCount(STEPS.length);
		for (let i = 0; i < STEPS.length; i++) {
			const desc = (await items.nth(i).locator('.desc').textContent())?.trim() ?? '';
			expect(desc, STEPS[i]).not.toBe('');
		}
	});

	test('Scenario: Paso opcional y paso del perfil ampliado marcados', async ({ page }) => {
		const step = (cmd: string) => cycleItems(page).filter({ has: page.locator('code', { hasText: cmd }) });
		await expect(step('/opsx:explore')).toContainText('opcional');
		await expect(step('/opsx:verify')).toContainText('perfil ampliado');
	});

	test('Scenario: Comandos /opsx de la home documentados', async ({ page }) => {
		const text = (await page.locator('body').textContent()) ?? '';
		expect(text).toMatch(/\/opsx:/);
		expect(undocumentedCommands(text, await chatReference(page))).toEqual([]);
	});

	test('Scenario: Comando inexistente en la home detectado', async ({ page }) => {
		const home = (await page.locator('body').textContent()) ?? '';
		const reference = await chatReference(page);
		expect(reference.workflows).toContain('verify');
		expect(undocumentedCommands(`${home} /opsx:deploy`, reference)).toEqual(['deploy']);
	});

	test('Scenario: Figura con nombre accesible y texto de spec', async ({ page }) => {
		const fig = figure(page);
		await expect(fig).toHaveCount(1);
		await expect(fig).toHaveAccessibleName(/\S/);
		await expect(fig.locator('img')).toHaveCount(0);
		for (const fragment of ['ADDED Requirements', 'Requirement:', 'Scenario:', 'WHEN', 'THEN']) {
			await expect(fig).toContainText(fragment);
		}
	});

	test('Scenario: Pestañas decorativas no interactivas', async ({ page }) => {
		const fig = figure(page);
		const tabs = fig.locator('[aria-hidden="true"]').filter({ hasText: 'proposal.md' });
		await expect(tabs).toHaveCount(1);
		await expect(tabs).toContainText('tasks.md');
		await expect(fig.locator('[role="tab"], [role="tablist"], button')).toHaveCount(0);
	});

	test('Scenario: Recuento de escenarios coherente', async ({ page }) => {
		const fig = figure(page);
		const shown = Number((await fig.locator('[data-scenario-count]').textContent())?.trim());
		const lines = await fig.locator('pre .linea').allTextContents();
		const scenarios = lines.filter((l) => /^\s*[+\-]?\s*#### Scenario:/.test(l)).length;
		expect(scenarios).toBeGreaterThan(0);
		expect(shown).toBe(scenarios);
	});

	test('Scenario: Carpetas y etiquetas presentes', async ({ page }) => {
		const section = sectionByHeading(page, 'Dos carpetas, un modelo mental');
		await expect(section).toHaveCount(1);
		for (const fragment of ['openspec/changes/', 'openspec/changes/archive/', 'openspec/specs/', 'ADDED', 'MODIFIED', 'REMOVED', 'RENAMED']) {
			await expect(section).toContainText(fragment);
		}
	});

	test('Scenario: Enlace a conceptos', async ({ page, request }) => {
		const link = sectionByHeading(page, 'Dos carpetas, un modelo mental').locator('a[href="/empieza/conceptos/"]');
		await expect(link).toHaveCount(1);
		expect((await request.get('/empieza/conceptos/')).status()).toBe(200);
	});

	test('Scenario: Enlaces de En equipo', async ({ page, request }) => {
		const section = sectionByHeading(page, 'En equipo');
		await expect(section).toHaveCount(1);
		const hrefs = await section.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
		for (const href of ['/equipo/jira/', '/equipo/azure-devops/', '/equipo/ci/', '/equipo/gobierno/', '/equipo/adopcion/']) {
			expect(hrefs).toContain(href);
			expect((await request.get(href)).status(), href).toBe(200);
		}
	});

	test('Scenario: Enlaces de Para llevártelo', async ({ page, request }) => {
		const section = sectionByHeading(page, 'Para llevártelo');
		await expect(section).toHaveCount(1);
		const hrefs = await section.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
		for (const href of [PDF, '/recursos/', '/como-se-hizo/']) {
			expect(hrefs).toContain(href);
			expect((await request.get(href)).status(), href).toBe(200);
		}
	});

	test('Scenario: Sin animaciones con prefers-reduced-motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('main .recorrido').first().hover();
		expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
	});

	test('Scenario: Home sin desbordamiento horizontal a 360 px', async ({ page }) => {
		await page.setViewportSize({ width: 360, height: 800 });
		await page.goto('/');
		await expect(figure(page)).toBeVisible();
		const { scroll, viewport } = await page.evaluate(() => ({
			scroll: document.documentElement.scrollWidth,
			viewport: document.documentElement.clientWidth,
		}));
		expect(scroll).toBeLessThanOrEqual(viewport);
	});

	test('Scenario: Iconos de la home ocultos a tecnologías de apoyo', async ({ page }) => {
		const icons = page.locator('main svg');
		expect(await icons.count()).toBeGreaterThan(0);
		for (const icon of await icons.all()) {
			await expect(icon).toHaveAttribute('aria-hidden', 'true');
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
