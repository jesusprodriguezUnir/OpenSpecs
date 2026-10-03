import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

describe('calidad: scripts', () => {
	test('Scenario: Scripts de calidad disponibles', () => {
		for (const name of ['check', 'test:unit', 'test:e2e', 'test', 'links']) {
			expect(pkg.scripts, `missing script "${name}"`).toHaveProperty(name);
		}
	});

	test('Scenario: El script test encadena unitarios y E2E', () => {
		const steps = pkg.scripts.test.split('&&').map((s) => s.trim());
		expect(steps).toEqual(['npm run test:unit', 'npm run test:e2e']);
	});
});
