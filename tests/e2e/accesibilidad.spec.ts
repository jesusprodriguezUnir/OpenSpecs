import { expect, test } from '@playwright/test';
import { expectNoSevereViolations } from './axe';

test.describe('accesibilidad', () => {
	test('Scenario: Una página de guía sin violaciones graves de accesibilidad', async ({ page }) => {
		await page.goto('/empieza/que-es/');
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
