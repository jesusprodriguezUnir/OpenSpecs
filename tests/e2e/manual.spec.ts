import { expect, test, type Page } from '@playwright/test';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';
import { siteMapSlugs } from './site-map';

const SIDEBAR = '#starlight__sidebar';
const PDF = '/manual-openspec.pdf';

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page
		.$$eval('script', (nodes) =>
			nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
		)
		.then(executableScripts);

async function sidebarPages(page: Page): Promise<{ href: string; label: string }[]> {
	await page.goto('/empieza/que-es/');
	const links = await page
		.locator(`${SIDEBAR} a[href^="/"]`)
		.evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href') ?? '', label: a.textContent?.trim() ?? '' })));
	return links.filter((l) => l.href !== PDF);
}

test.describe('contenido: manual', () => {
	test('Scenario: Manual con todas las páginas en orden del sidebar', async ({ page }) => {
		const expected = await sidebarPages(page);
		expect(expected.map((l) => l.href)).toEqual(siteMapSlugs);
		const response = await page.goto('/manual/');
		expect(response?.status()).toBe(200);
		const titles = await page.locator('[data-manual-section] > h2').allTextContents();
		expect(titles.map((t) => t.trim())).toEqual(expected.map((l) => l.label));
	});

	test('Scenario: Índice enlazado a cada sección', async ({ page }) => {
		await page.goto('/manual/');
		const sections = await page.locator('[data-manual-section]').evaluateAll((s) => s.map((e) => e.id));
		const hrefs = await page.locator('nav.toc a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs).toEqual(['#como-usar-este-manual', ...sections.map((id) => `#${id}`)]);
		for (const id of sections) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
	});

	test('Scenario: Portada del manual', async ({ page }) => {
		await page.goto('/manual/');
		const first = page.locator('[data-manual] > section').first();
		await expect(first).toHaveAttribute('data-manual-cover', '');
		await expect(first.locator('h2')).toHaveText(/OpenSpec\s*desde cero/);
		await expect(first.locator('[data-manual-author]')).toHaveText('Jesús Pedro Rodríguez');
		await expect(first.locator('[data-manual-version]')).toContainText(/OpenSpec v\d+\.\d+\.\d+/);
	});

	test('Scenario: Capítulo de cómo usar el manual', async ({ page }) => {
		await page.goto('/manual/');
		const order = await page
			.locator('[data-manual] > section')
			.evaluateAll((s) => s.map((e) => (e.hasAttribute('data-manual-howto') ? 'howto' : e.id || 'cover')));
		const howto = order.indexOf('howto');
		expect(howto).toBeGreaterThan(-1);
		const firstChapter = await page.locator('[data-manual-section]').first().getAttribute('id');
		expect(howto).toBeLessThan(order.indexOf(firstChapter!));
		const section = page.locator('[data-manual-howto]');
		await expect(section.locator('h2')).toHaveText('Cómo usar este manual');
		const links = await section.locator('table[data-manual-route] tbody a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
		expect(links.length).toBeGreaterThan(0);
		for (const href of links) await expect(page.locator(`[data-manual-section][id="${href.slice(1)}"]`)).toHaveCount(1);
	});

	test('Scenario: Índice agrupado en partes', async ({ page }) => {
		const groups = await page
			.goto('/empieza/que-es/')
			.then(() => page.locator(`${SIDEBAR} ul.top-level > li > details summary .group-label`).allTextContents());
		await page.goto('/manual/');
		const parts = page.locator('nav.toc [data-manual-part]');
		const titles = (await parts.locator('.part-title').allTextContents()).map((t) => t.trim());
		expect(titles).toEqual(groups.map((g) => g.trim()));
		const labels = await page.locator('[data-manual-section] [data-manual-label]').allTextContents();
		const numbers = (await parts.locator('li .num').allTextContents()).map((t) => t.trim());
		expect(numbers).toEqual(['00', ...labels.map((l) => l.trim().split(' ').at(-1))]);
		expect(labels[0].trim()).toBe('Capítulo 01');
		expect(labels.some((l) => l.trim() === 'Anexo A')).toBe(true);
	});

	test('Scenario: Manual fuera de buscadores y del sitemap', async ({ page, request }) => {
		await page.goto('/manual/');
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
		const index = await (await request.get('/sitemap-index.xml')).text();
		const loc = index.match(/<loc>([^<]+)<\/loc>/)?.[1];
		const sitemap = await (await request.get(new URL(loc!).pathname)).text();
		expect(sitemap).toContain('/empieza/que-es/</loc>');
		expect(sitemap).not.toContain('/manual/');
	});

	test('Scenario: Manual excluido de la búsqueda', async ({ page }) => {
		await page.goto('/manual/');
		await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
		await page.goto('/empieza/que-es/');
		await page.locator('site-search button[data-open-modal]').click();
		// «imprimible» only appears on the manual cover.
		await page.locator('site-search .pagefind-ui__search-input').fill('imprimible');
		await expect(page.locator('.pagefind-ui__message')).toBeVisible();
		await expect(page.locator('.pagefind-ui__result a[href*="/manual/"]')).toHaveCount(0);
		await page.locator('site-search .pagefind-ui__search-input').fill('OpenSpec');
		await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
		await expect(page.locator('.pagefind-ui__result a[href*="/manual/"]')).toHaveCount(0);
	});

	test('Scenario: Manual sin JavaScript propio', async ({ page }) => {
		// Allowed: any script that a regular content page already loads.
		const allowed: ScriptRef[] = [];
		for (const slug of siteMapSlugs) {
			await page.goto(slug);
			allowed.push(...(await scriptsOf(page)));
		}
		await page.goto('/manual/');
		expect(scriptExtras(await scriptsOf(page), allowed)).toEqual([]);
	});
});

test.describe('contenido: manual en PDF', () => {
	test('Scenario: PDF servido', async ({ request }) => {
		const response = await request.get(PDF);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('application/pdf');
		expect((await response.body()).subarray(0, 5).toString('latin1')).toBe('%PDF-');
	});

	test('Scenario: Enlace de descarga en la landing', async ({ page }) => {
		await page.goto('/');
		const link = page.locator(`main a[href="${PDF}"]`);
		await expect(link).toHaveCount(1);
		await expect(link).toHaveAttribute('download', '');
		await expect(link).toContainText('Manual en PDF');
		await expect(link).toContainText(/\d+,\d MB/);
		await expect(link).toBeVisible();
	});

	test('Scenario: Enlace de descarga en el sidebar', async ({ page }) => {
		await page.goto('/guias/flujo-opsx/');
		const group = page.locator(`${SIDEBAR} ul.top-level > li > details`, {
			has: page.locator('summary .group-label', { hasText: 'Recursos' }),
		});
		const link = group.locator(`a[href="${PDF}"]`);
		await expect(link).toHaveCount(1);
		await expect(link).toHaveAttribute('download', '');
		await expect(link).toContainText('Manual en PDF');
		await expect(link).toContainText(/\d+,\d MB/);
		await expect(page.locator(`${SIDEBAR} ul.top-level > li`)).toHaveCount(7);
	});
});
