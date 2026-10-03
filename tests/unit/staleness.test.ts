import { describe, expect, test } from 'vitest';
import { getBuildDate, isStale } from '../../src/lib/staleness';

const BUILD = new Date('2027-04-02T10:30:00Z');

describe('contenido: caducidad', () => {
	test('Scenario: Página revisada hace más de 180 días', () => {
		expect(isStale(new Date('2026-10-03'), BUILD)).toBe(true);
	});

	test('Scenario: Página revisada hace exactamente 180 días', () => {
		expect(isStale(new Date('2026-10-04'), BUILD)).toBe(false);
	});

	test('Scenario: Página revisada recientemente', () => {
		expect(isStale(new Date('2027-04-02'), BUILD)).toBe(false);
	});

	test('BUILD_DATE fija la fecha del build y sin ella se usa la actual', () => {
		expect(getBuildDate({ BUILD_DATE: '2027-04-02' }).toISOString()).toBe('2027-04-02T00:00:00.000Z');
		const before = Date.now();
		expect(getBuildDate({}).getTime()).toBeGreaterThanOrEqual(before);
		expect(() => getBuildDate({ BUILD_DATE: 'mañana' })).toThrow(/BUILD_DATE/);
	});
});
