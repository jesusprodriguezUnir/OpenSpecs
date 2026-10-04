import { describe, expect, test } from 'vitest';
import { scriptExtras } from '../e2e/script-budget';

describe('landing: presupuesto de JS', () => {
	test('Scenario: Script extra detectado', () => {
		const guide = [{ src: '/_astro/starlight.js', content: '' }, { src: null, content: 'theme()' }];
		const landing = [...guide, { src: '/_astro/landing.js', content: '' }];
		expect(scriptExtras(landing, guide)).toEqual(['src:/_astro/landing.js']);
	});

	test('helper ignora espacios en scripts inline', () => {
		const guide = [{ src: null, content: ' theme() ' }];
		expect(scriptExtras([{ src: null, content: 'theme()' }], guide)).toEqual([]);
	});
});
