import { expect, test } from '@playwright/test';
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
