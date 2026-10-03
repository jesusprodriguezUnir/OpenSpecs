import { expect, test } from '@playwright/test';

// The E2E build runs with BUILD_DATE=2027-04-02 (playwright.config.ts): placeholders reviewed on
// 2026-10-03 are 181 days old there, so the stale warning is expected on guide pages.
const HEADER = '[data-guide-meta]';

test.describe('contenido', () => {
	test('Scenario: Cabecera completa en una guía', async ({ page }) => {
		await page.goto('/empieza/primer-cambio/');
		const header = page.locator(HEADER);
		await expect(header).toHaveCount(1);
		await expect(header.locator('[data-meta="level"] dd')).toHaveText('Inicio');
		await expect(header.locator('[data-meta="duration"] dd')).toHaveText('30 min');
		await expect(header.locator('[data-meta="openspec-version"] dd')).toHaveText('1.14.0');
		await expect(header.locator('[data-meta="last-reviewed"] dd')).toHaveText('3 de octubre de 2026');
	});

	test('Scenario: Guía sin duración', async ({ page }) => {
		await page.goto('/guias/recetas/');
		const header = page.locator(HEADER);
		await expect(header.locator('[data-meta="level"] dd')).toHaveText('Intermedio');
		await expect(header.locator('[data-meta="openspec-version"] dd')).toHaveText('1.14.0');
		await expect(header.locator('[data-meta="last-reviewed"] dd')).toHaveText('3 de octubre de 2026');
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
