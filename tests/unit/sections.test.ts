import { describe, expect, it } from 'vitest';
import { pagesLabel, sectionPageCount } from '../../src/lib/sections';

const entry = (id: string, sidebar?: { order?: number; hidden?: boolean }) => ({ id, data: { title: id, sidebar } });

describe('sectionPageCount', () => {
	const entries = [
		entry('index'),
		entry('empieza/que-es', { order: 1 }),
		entry('empieza/instalacion', { order: 2 }),
		entry('empieza/borrador', { hidden: true }),
		entry('equipo/jira'),
		entry('empiezaotra/x'),
	];

	it('cuenta las páginas visibles de la sección', () => {
		expect(sectionPageCount(entries, 'empieza')).toBe(2);
		expect(sectionPageCount(entries, 'equipo')).toBe(1);
	});

	it('devuelve 0 para una sección sin páginas', () => {
		expect(sectionPageCount(entries, 'referencia')).toBe(0);
	});
});

describe('pagesLabel', () => {
	it('usa singular y plural', () => {
		expect(pagesLabel(1)).toBe('1 página');
		expect(pagesLabel(4)).toBe('4 páginas');
	});
});
