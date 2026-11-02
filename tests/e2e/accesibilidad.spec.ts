import { expect, test, type Page } from '@playwright/test';
import { expectNoSevereViolations } from './axe';

test.describe('accesibilidad', () => {
	test('Scenario: Una página de guía sin violaciones graves de accesibilidad', async ({ page }) => {
		await page.goto('/empieza/que-es/');
		await expectNoSevereViolations(page);
	});

	const guideInTheme = async (page: Page, theme: 'light' | 'dark') => {
		await page.emulateMedia({ colorScheme: theme });
		await page.goto('/empieza/que-es/');
		await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await expectNoSevereViolations(page);
	};

	test('Scenario: Página de guía en tema claro sin violaciones graves', async ({ page }) => {
		await guideInTheme(page, 'light');
	});

	test('Scenario: Página de guía en tema oscuro sin violaciones graves', async ({ page }) => {
		await guideInTheme(page, 'dark');
	});

	test('Scenario: La landing sin violaciones graves de accesibilidad', async ({ page }) => {
		await page.goto('/');
		await expectNoSevereViolations(page);
	});

	test('Scenario: La landing en tema claro sin violaciones graves', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
		await expectNoSevereViolations(page);
	});

	test('Scenario: El manual imprimible sin violaciones graves de accesibilidad', async ({ page }) => {
		await page.goto('/manual/');
		await expectNoSevereViolations(page);
	});

	test('Scenario: La 404 sin violaciones graves de accesibilidad', async ({ page }) => {
		await page.goto('/ruta-inexistente/');
		await expectNoSevereViolations(page);
	});

	test('Scenario: Una violación grave falla el test', async ({ page }) => {
		await page.setContent(
			'<!doctype html><html lang="es-ES"><head><title>x</title></head><body><main><h1>x</h1><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></main></body></html>',
		);
		await expect(expectNoSevereViolations(page)).rejects.toThrow(/image-alt/);
	});
});
