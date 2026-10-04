import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { expectNoSevereViolations } from './axe';
import { executableScripts, scriptExtras, type ScriptRef } from './script-budget';

const REPO_URL = 'https://github.com/jesusprodriguezUnir/OpenSpecs';
const ARCHIVE_DIR = 'openspec/changes/archive';
const SPECS_DIR = 'openspec/specs';

const folders = (dir: string, file: string) =>
	readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && existsSync(`${dir}/${d.name}/${file}`))
		.map((d) => d.name);

// Archived changes, newest first (same ordering rule as the page: date desc, then name).
const archived = folders(ARCHIVE_DIR, 'proposal.md')
	.filter((f) => /^\d{4}-\d{2}-\d{2}-.+/.test(f))
	.sort((a, b) => b.slice(0, 10).localeCompare(a.slice(0, 10)) || a.slice(11).localeCompare(b.slice(11)));

const domains = folders(SPECS_DIR, 'spec.md').sort();

const scriptsOf = (page: Page): Promise<ScriptRef[]> =>
	page
		.$$eval('script', (nodes) =>
			nodes.map((n) => ({ src: n.getAttribute('src'), content: n.textContent ?? '', type: n.getAttribute('type') })),
		)
		.then(executableScripts);

test.describe('como-se-hizo', () => {
	test('Scenario: Changes ordenados del más reciente al más antiguo', async ({ page }) => {
		expect(archived.length).toBeGreaterThan(1);
		await page.goto('/como-se-hizo/');
		const items = page.locator('.history-changes > li');
		await expect(items).toHaveCount(archived.length);
		for (const [i, folder] of archived.entries()) {
			const item = items.nth(i);
			await expect(item.locator('time')).toHaveText(folder.slice(0, 10));
			await expect(item.locator('a')).toHaveText(folder.slice(11));
		}
	});

	test('Scenario: Enlace a la carpeta del change', async ({ page }) => {
		await page.goto('/como-se-hizo/');
		for (const folder of archived) {
			await expect(
				page.locator(`.history-changes a[href="${REPO_URL}/tree/main/${ARCHIVE_DIR}/${folder}"]`),
				folder,
			).toHaveCount(1);
		}
	});

	test('Scenario: Dominios con número de requisitos', async ({ page }) => {
		expect(domains.length).toBeGreaterThan(0);
		await page.goto('/como-se-hizo/');
		const items = page.locator('.history-domains > li');
		await expect(items).toHaveCount(domains.length);
		for (const [i, domain] of domains.entries()) {
			const expected = (readFileSync(`${SPECS_DIR}/${domain}/spec.md`, 'utf8').match(/^###\s+Requirement:/gm) ?? [])
				.length;
			const item = items.nth(i);
			await expect(item.locator('a'), domain).toHaveText(domain);
			await expect(item.locator('a'), domain).toHaveAttribute(
				'href',
				`${REPO_URL}/blob/main/${SPECS_DIR}/${domain}/spec.md`,
			);
			await expect(item.locator('.requirements-count'), domain).toHaveText(String(expected));
		}
	});

	test('Scenario: Página sin scripts propios', async ({ page }) => {
		await page.goto('/como-se-hizo/');
		const history = await scriptsOf(page);
		await page.goto('/empieza/que-es/');
		const guide = await scriptsOf(page);
		expect(scriptExtras(history, guide)).toEqual([]);
		await page.goto('/como-se-hizo/');
		await expectNoSevereViolations(page);
	});
});
