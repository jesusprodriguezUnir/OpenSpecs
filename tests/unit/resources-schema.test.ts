import { describe, expect, test } from 'vitest';
import { resourceSchema } from '../../src/lib/resources-schema';

const valid: Record<string, unknown> = {
	title: 'OpenSpec',
	url: 'https://github.com/Fission-AI/OpenSpec',
	type: 'oficial',
	lang: 'en',
};

/** Paths of the fields that fail validation. */
const failingFields = (data: Record<string, unknown>) => {
	const result = resourceSchema.safeParse(data);
	return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
};

describe('contenido: colección de recursos validada', () => {
	test('a complete https entry is valid', () => {
		expect(failingFields(valid)).toEqual([]);
	});

	test('Scenario: Recurso sin URL', () => {
		const { url: _omitted, ...withoutUrl } = valid;
		expect(failingFields(withoutUrl)).toEqual(['url']);
	});

	test('Scenario: URL no válida', () => {
		expect(failingFields({ ...valid, url: 'intent-driven.dev' })).toEqual(['url']);
	});

	test('Scenario: URL sin https', () => {
		expect(failingFields({ ...valid, url: 'http://example.com' })).toEqual(['url']);
	});

	test('Scenario: Tipo no permitido', () => {
		expect(failingFields({ ...valid, type: 'blog' })).toEqual(['type']);
	});

	test('Scenario: Idioma no permitido', () => {
		expect(failingFields({ ...valid, lang: 'fr' })).toEqual(['lang']);
	});
});
