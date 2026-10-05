import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

// Normalize CRLF: Windows checkouts may convert the workflow's line endings.
const ci = readFileSync('.github/workflows/ci.yml', 'utf8').replace(/\r\n/g, '\n');
const playwrightConfig = readFileSync('playwright.config.ts', 'utf8');

/** Returns the text of one top-level job of the workflow. */
function job(name: string): string {
	const start = ci.indexOf(`\n  ${name}:\n`);
	expect(start, `job "${name}" not found in ci.yml`).toBeGreaterThan(-1);
	const rest = ci.slice(start + 1);
	const next = rest.slice(1).search(/\n {2}[a-z-]+:\n/);
	return next === -1 ? rest : rest.slice(0, next + 1);
}

describe('calidad: workflow de CI', () => {
	test('Scenario: Un PR con specs inválidas falla el job openspec', () => {
		expect(job('openspec')).toContain('openspec validate --all --strict --no-interactive');
	});

	test('Scenario: Versión de OpenSpec fijada', () => {
		expect(ci).toMatch(/OPENSPEC_VERSION: \d+\.\d+\.\d+\s/);
		expect(ci).toContain('OPENSPEC_VERSION: 1.14.0');
		expect(ci).not.toMatch(/openspec@latest/);
	});

	test('Scenario: Un error de tipos falla la CI', () => {
		const build = job('build');
		expect(build).toContain('npm run check');
		expect(build.indexOf('npm run check')).toBeLessThan(build.indexOf('npm run build'));
	});

	test('Scenario: Frontmatter inválido falla la CI', () => {
		expect(job('build')).toContain('npm run build');
	});

	test('Scenario: PDF desfasado falla la CI', () => {
		const build = job('build');
		expect(build).toContain('npm run manual:check');
		expect(build.indexOf('npm run build')).toBeLessThan(build.indexOf('npm run manual:check'));
	});

	test('Scenario: Un test unitario en rojo falla la CI', () => {
		expect(job('unit')).toContain('npm run test:unit');
	});

	test('Scenario: Un test E2E en rojo falla la CI', () => {
		expect(job('e2e')).toContain('npm run test:e2e');
	});

	test('Scenario: Los tests de Playwright usan astro preview', () => {
		expect(playwrightConfig).toMatch(/npm run build && npm run preview/);
		expect(playwrightConfig).not.toMatch(/astro dev|npm run dev/);
	});

	test('Scenario: Un fallo no oculta a los demás jobs', () => {
		expect(ci).not.toContain('continue-on-error');
		expect(ci).not.toContain('fail-fast');
		const needs = [...ci.matchAll(/\n {4}needs: (.+)/g)].map((m) => m[1].trim());
		expect(needs).toEqual(['build']);
		expect(job('links')).toContain('needs: build');
	});
});
