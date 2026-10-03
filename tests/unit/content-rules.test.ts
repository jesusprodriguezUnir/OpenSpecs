import { describe, expect, test } from 'vitest';
import { requiredFieldsFor, validateGuideFrontmatter } from '../../src/lib/content-rules';

const complete: Record<string, unknown> = {
	title: 'Página',
	openspecVersion: '1.14.0',
	lastReviewed: new Date('2026-10-03'),
	level: 'intermedio',
};

function without(...fields: string[]): Record<string, unknown> {
	const copy = { ...complete };
	for (const field of fields) delete copy[field];
	return copy;
}

describe('contenido: metadatos obligatorios', () => {
	test('Scenario: Guía sin openspecVersion', () => {
		const issues = validateGuideFrontmatter('guias/recetas', without('openspecVersion'));
		expect(issues.join('\n')).toMatch(/guias\/recetas.*openspecVersion/);
	});

	test('Scenario: Guía sin lastReviewed', () => {
		const issues = validateGuideFrontmatter('empieza/que-es', without('lastReviewed'));
		expect(issues.join('\n')).toMatch(/empieza\/que-es.*lastReviewed/);
	});

	test('Scenario: Guía sin level', () => {
		const issues = validateGuideFrontmatter('agentes/claude-code', without('level'));
		expect(issues.join('\n')).toMatch(/agentes\/claude-code.*level/);
	});

	test('Scenario: Guía sin duration', () => {
		expect(requiredFieldsFor('equipo/jira')).not.toContain('duration');
		expect(validateGuideFrontmatter('equipo/jira', complete)).toEqual([]);
	});

	test('Scenario: Referencia sin lastReviewed', () => {
		const issues = validateGuideFrontmatter('referencia/cli', without('lastReviewed', 'level'));
		expect(issues.join('\n')).toMatch(/referencia\/cli.*lastReviewed/);
	});

	test('Scenario: Referencia sin level', () => {
		expect(requiredFieldsFor('referencia/cli')).toEqual(['openspecVersion', 'lastReviewed']);
		expect(validateGuideFrontmatter('referencia/cli', without('level'))).toEqual([]);
	});

	test('Scenario: Landing sin metadatos', () => {
		expect(validateGuideFrontmatter('index', { title: 'OpenSpec desde cero' })).toEqual([]);
		for (const id of ['index', '404', 'recursos', 'como-se-hizo']) {
			expect(requiredFieldsFor(id), id).toEqual([]);
		}
	});
});

describe('contenido: valores válidos', () => {
	test('Scenario: Nivel no permitido', () => {
		const issues = validateGuideFrontmatter('guias/recetas', { ...complete, level: 'experto' });
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/level/);
	});

	test('Scenario: Versión con formato inválido', () => {
		const issues = validateGuideFrontmatter('guias/recetas', { ...complete, openspecVersion: 'v1' });
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/openspecVersion/);
	});
});
