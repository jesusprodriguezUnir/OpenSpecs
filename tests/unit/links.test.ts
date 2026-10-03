import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const lycheeAvailable = spawnSync('lychee', ['--version']).error === undefined;
const fixture = (name: string) => resolve('tests/unit/fixtures/links', name);
const checkLinks = (name: string) =>
	spawnSync(process.execPath, ['scripts/links.mjs', fixture(name)], { encoding: 'utf8' });

// In CI lychee is always installed; locally the tests are skipped if the binary is missing.
describe.skipIf(!lycheeAvailable)('calidad: enlaces internos', () => {
	test('Scenario: Un sitio sin enlaces rotos pasa', () => {
		expect(checkLinks('ok').status).toBe(0);
	});

	test('Scenario: Un enlace interno roto falla el job de enlaces', () => {
		const result = checkLinks('roto');
		expect(result.status).not.toBe(0);
		expect(result.stdout + result.stderr).toContain('no-existe');
	});

	test('Scenario: Un fragmento inexistente falla el job de enlaces', () => {
		expect(checkLinks('fragmento').status).not.toBe(0);
	});

	test('Scenario: Un enlace externo no bloquea', () => {
		expect(checkLinks('externo').status).toBe(0);
	});
});
