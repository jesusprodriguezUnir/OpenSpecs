import { expect, test, type Page } from '@playwright/test';
import { siteMapSlugs } from './site-map';

const SIDEBAR = '#starlight__sidebar';
const EXPECTED_GROUPS = [
	'Empieza',
	'Guías',
	'Con tu agente',
	'En equipo',
	'Referencia',
	'Recursos',
	'Cómo se hizo',
];

test.describe('navegacion', () => {
	test('Scenario: Orden de las secciones del sidebar', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		const groups = page.locator(`${SIDEBAR} ul.top-level > li > details > summary .group-label`);
		await expect(groups).toHaveText(EXPECTED_GROUPS);
		// No top-level entries other than the expected groups (e.g. loose links).
		await expect(page.locator(`${SIDEBAR} ul.top-level > li`)).toHaveCount(EXPECTED_GROUPS.length);
	});

	test('Scenario: Todas las rutas del mapa responden', async ({ page }) => {
		for (const slug of siteMapSlugs) {
			const response = await page.goto(slug);
			expect(response?.status(), slug).toBe(200);
			await expect(page.locator('h1'), slug).not.toBeEmpty();
		}
	});

	test('Scenario: Cada página del mapa está enlazada en el sidebar', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		for (const slug of siteMapSlugs) {
			await expect(page.locator(`${SIDEBAR} a[href="${slug}"]`), slug).toHaveCount(1);
		}
	});

	test('Scenario: Página actual marcada en el sidebar', async ({ page }) => {
		await page.goto('/guias/flujo-opsx/');
		await expect(page.locator(`${SIDEBAR} a[href="/guias/flujo-opsx/"]`)).toHaveAttribute(
			'aria-current',
			'page',
		);
	});

	test('Scenario: Ruta inexistente devuelve la 404 propia', async ({ page }) => {
		const response = await page.goto('/esta-ruta-no-existe/');
		expect(response?.status()).toBe(404);
		await expect(page.locator('h1')).toHaveText('Página no encontrada');
	});

	test('Scenario: La 404 enlaza a inicio', async ({ page }) => {
		await page.goto('/esta-ruta-no-existe/');
		await expect(page.locator('main a[href="/"]')).toHaveCount(1);
	});

	test('Scenario: La 404 da acceso a la búsqueda', async ({ page }) => {
		await page.goto('/esta-ruta-no-existe/');
		await page.locator('site-search button[data-open-modal]').click();
		await expect(page.locator('site-search dialog')).toBeVisible();
	});

	test('Scenario: Ruta de ejemplo no publicada', async ({ page }) => {
		const response = await page.goto('/guides/example/');
		expect(response?.status()).toBe(404);
	});
});

const GROUP_SUMMARIES = `${SIDEBAR} ul.top-level > li > details > summary`;
const NUMBERED = 5;

test.describe('navegacion: grupos numerados', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto('/empieza/que-es/');
	});

	const prefixes = (page: Page) =>
		page
			.locator(`${GROUP_SUMMARIES} .group-label`)
			.evaluateAll((labels) => labels.map((l) => getComputedStyle(l, '::before').content));

	test('Scenario: Prefijos en orden', async ({ page }) => {
		const contents = await prefixes(page);
		const shown = contents.slice(0, NUMBERED).map((c) => c.match(/"(\d{2})/)?.[1]);
		expect(shown).toEqual(['01', '02', '03', '04', '05']);
		await expect(page.locator(`${GROUP_SUMMARIES} .group-label`).first()).toBeVisible();
	});

	test('Scenario: Grupos sin número', async ({ page }) => {
		const labels = await page.locator(`${GROUP_SUMMARIES} .group-label`).allTextContents();
		const contents = await prefixes(page);
		for (const group of ['Recursos', 'Cómo se hizo']) {
			const i = labels.map((l) => l.trim()).indexOf(group);
			expect(i, group).toBeGreaterThanOrEqual(NUMBERED);
			expect(contents[i], group).not.toMatch(/\d/);
		}
	});

	test('Scenario: Prefijo fuera del nombre accesible', async ({ page }) => {
		const summaries = page.locator(GROUP_SUMMARIES);
		await expect(summaries).toHaveCount(EXPECTED_GROUPS.length);
		for (let i = 0; i < EXPECTED_GROUPS.length; i++) {
			await expect(summaries.nth(i), EXPECTED_GROUPS[i]).toHaveAccessibleName(EXPECTED_GROUPS[i]);
		}
	});
});

const BANNER = '[data-progress]';

/** Pages of every top-level sidebar group (hrefs ending in «/»), in sidebar order. */
async function sidebarGroups(page: Page): Promise<{ name: string; pages: string[] }[]> {
	await page.goto('/empieza/que-es/');
	return page.locator(`${SIDEBAR} ul.top-level > li`).evaluateAll((lis) =>
		lis.map((li) => ({
			name: li.querySelector(':scope > details > summary .group-label')?.textContent?.trim() ?? '',
			pages: [...li.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '').filter((h) => h.endsWith('/')),
		})),
	);
}

test.describe('navegacion: banner de progreso', () => {
	test('Scenario: Primera página de Empieza', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		const banner = page.locator(BANNER);
		await expect(banner).toHaveCount(1);
		await expect(banner).toContainText('Empieza');
		await expect(banner).toContainText('paso 1 de 4');
	});

	test('Scenario: Posición según el orden del sidebar', async ({ page }) => {
		const groups = (await sidebarGroups(page)).filter((g) => g.pages.length >= 2);
		expect(groups.length).toBeGreaterThan(0);
		for (const group of groups) {
			for (const [i, href] of group.pages.entries()) {
				await page.goto(href);
				await expect(page.locator(BANNER), href).toHaveText(
					new RegExp(`${group.name}\\s*·\\s*paso ${i + 1} de ${group.pages.length}`),
				);
			}
		}
	});

	test('Scenario: Barra decorativa oculta', async ({ page }) => {
		await page.goto('/guias/flujo-opsx/');
		const bar = page.locator(`${BANNER} .barra`);
		await expect(bar).toHaveCount(1);
		expect(await bar.evaluate((el) => Boolean(el.closest('[aria-hidden="true"]')))).toBe(true);
	});

	test('Scenario: Páginas sin banner', async ({ page }) => {
		for (const path of ['/', '/recursos/', '/como-se-hizo/', '/esta-ruta-no-existe/']) {
			await page.goto(path);
			await expect(page.locator('h1').first(), path).not.toBeEmpty();
			await expect(page.locator(BANNER), path).toHaveCount(0);
		}
	});
});
