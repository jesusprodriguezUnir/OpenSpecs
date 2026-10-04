import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

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
