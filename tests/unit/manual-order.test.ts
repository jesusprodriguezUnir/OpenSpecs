import { describe, expect, test } from 'vitest';
import { editionDate, manualAnchor, orderManualEntries, referenceVersion, type ManualEntry } from '../../src/lib/manual-order';

const entry = (id: string, order?: number, hidden = false): ManualEntry => ({
	id,
	data: { title: id, sidebar: { order, hidden } },
});

const fixture: ManualEntry[] = [
	entry('index'),
	entry('404'),
	entry('legal/privacidad'),
	entry('guias/recetas', 2),
	entry('empieza/conceptos', 2),
	entry('empieza/que-es', 1),
	entry('guias/formato-de-specs', 1),
	entry('recursos', 1),
	entry('como-se-hizo', 1),
];

const ids = (entries: ManualEntry[]) => orderManualEntries(entries).map((s) => s.entry.id);

describe('contenido: orden del manual', () => {
	test('Scenario: Páginas no enlazadas en el sidebar quedan fuera', () => {
		const result = ids(fixture);
		expect(result).not.toContain('index');
		expect(result).not.toContain('404');
		expect(result).not.toContain('legal/privacidad');
		expect(result).toEqual([
			'empieza/que-es',
			'empieza/conceptos',
			'guias/formato-de-specs',
			'guias/recetas',
			'recursos',
			'como-se-hizo',
		]);
		expect(ids([...fixture, entry('guias/oculta', 1, true)])).not.toContain('guias/oculta');
	});

	test('Scenario: Página nueva aparece en el manual', () => {
		const result = ids([...fixture, entry('guias/nueva', 2), entry('referencia/glosario', 1)]);
		// Same order as the sidebar: by `sidebar.order`, ties by id; referencia goes before recursos.
		expect(result).toEqual([
			'empieza/que-es',
			'empieza/conceptos',
			'guias/formato-de-specs',
			'guias/nueva',
			'guias/recetas',
			'referencia/glosario',
			'recursos',
			'como-se-hizo',
		]);
		expect(manualAnchor('guias/nueva')).toBe('guias-nueva');
	});

	test('Scenario: Numeración de capítulos y anexos', () => {
		const sections = orderManualEntries([
			...fixture,
			entry('agentes/claude-code', 1),
			entry('equipo/ci', 1),
			entry('referencia/glosario', 1),
		]);
		expect(sections.map((s) => [s.entry.id, s.label])).toEqual([
			['empieza/que-es', 'Capítulo 01'],
			['empieza/conceptos', 'Capítulo 02'],
			['guias/formato-de-specs', 'Capítulo 03'],
			['guias/recetas', 'Capítulo 04'],
			['agentes/claude-code', 'Capítulo 05'],
			['equipo/ci', 'Capítulo 06'],
			['referencia/glosario', 'Anexo A'],
			['recursos', 'Anexo B'],
			['como-se-hizo', 'Anexo C'],
		]);
		expect(sections.filter((s) => s.kind === 'annex').map((s) => s.number)).toEqual(['A', 'B', 'C']);
	});

	test('versión de referencia y fecha de edición', () => {
		const v = (openspecVersion?: string, lastReviewed?: string) => ({ data: { openspecVersion, lastReviewed } });
		expect(referenceVersion([v('1.9.0'), v('1.14.0'), v(), v('1.13')])).toBe('1.14.0');
		expect(editionDate([v(undefined, '2026-09-30'), v(undefined, '2026-10-04')])).toBe('octubre de 2026');
	});
});
