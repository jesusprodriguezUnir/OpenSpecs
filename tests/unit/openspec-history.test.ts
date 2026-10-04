import { describe, expect, it } from 'vitest';
import {
	buildHistoryView,
	changeFolderUrl,
	countRequirements,
	extractWhySummary,
	parseArchiveFolder,
	sortChangesDesc,
	specFileUrl,
} from '../../src/lib/openspec-history';
import { REPO_URL } from '../../src/lib/site';

const proposal = (why: string) => `Roadmap: 01\n\n## Why\n\n${why}\n\n## What Changes\n\n- x\n`;
const archivePath = (folder: string) => `openspec/changes/archive/${folder}/proposal.md`;
const specPath = (domain: string) => `openspec/specs/${domain}/spec.md`;

describe('parseArchiveFolder', () => {
	it('splits date and name', () => {
		expect(parseArchiveFolder('2026-10-04-w05-seccion-empieza')).toEqual({
			date: '2026-10-04',
			name: 'w05-seccion-empieza',
		});
	});

	it('returns null without a date prefix', () => {
		expect(parseArchiveFolder('w05-seccion-empieza')).toBeNull();
	});
});

describe('historial de changes', () => {
	it('Scenario: Changes ordenados del más reciente al más antiguo', () => {
		const view = buildHistoryView(
			[
				{ filePath: archivePath('2026-10-03-w01-a'), body: proposal('Uno.') },
				{ filePath: archivePath('2026-10-04-w05-b'), body: proposal('Dos.') },
				{ filePath: archivePath('2026-10-04-w04-c'), body: proposal('Tres.') },
			],
			[],
		);
		expect(view.changes.map((c) => c.folder)).toEqual([
			'2026-10-04-w04-c',
			'2026-10-04-w05-b',
			'2026-10-03-w01-a',
		]);
		expect(view.changes[0]).toMatchObject({ date: '2026-10-04', name: 'w04-c' });
		expect(sortChangesDesc([{ date: '2026-01-01', name: 'a' }, { date: '2026-02-01', name: 'b' }])[0].name).toBe('b');
	});

	it('Scenario: Resumen tomado del primer párrafo de Why', () => {
		const summary = extractWhySummary(proposal('Primer párrafo\ncontinúa aquí.\n\nSegundo párrafo.'));
		expect(summary).toBe('Primer párrafo continúa aquí.');
	});

	it('Scenario: Proposal sin sección Why', () => {
		const view = buildHistoryView(
			[{ filePath: archivePath('2026-10-03-w01-a'), body: '## What Changes\n\n- x\n' }],
			[],
		);
		expect(view.changes).toHaveLength(1);
		expect(view.changes[0].summary).toBeUndefined();
	});

	it('Scenario: Enlace a la carpeta del change', () => {
		expect(changeFolderUrl('2026-10-03-w01-a')).toBe(
			`${REPO_URL}/tree/main/openspec/changes/archive/2026-10-03-w01-a`,
		);
	});

	it('Scenario: Sin changes archivados', () => {
		const view = buildHistoryView([], [{ filePath: specPath('seo'), body: '### Requirement: A\n' }]);
		expect(view.changes).toEqual([]);
		expect(view.showChangesEmpty).toBe(true);
		expect(view.showDomainsEmpty).toBe(false);
	});
});

describe('dominios de spec', () => {
	it('Scenario: Dominios con número de requisitos', () => {
		const body = '## Purpose\n\n### Requirement: A\n\n#### Scenario: x\n\n### Requirement: B\n';
		expect(countRequirements(body)).toBe(2);
		const view = buildHistoryView(
			[],
			[
				{ filePath: specPath('seo'), body },
				{ filePath: specPath('calidad'), body: '### Requirement: C\n' },
			],
		);
		expect(view.domains).toEqual([
			{ domain: 'calidad', requirements: 1 },
			{ domain: 'seo', requirements: 2 },
		]);
		expect(specFileUrl('seo')).toBe(`${REPO_URL}/blob/main/openspec/specs/seo/spec.md`);
	});

	it('Scenario: Sin specs actuales', () => {
		const view = buildHistoryView([{ filePath: archivePath('2026-10-03-w01-a'), body: '' }], []);
		expect(view.domains).toEqual([]);
		expect(view.showDomainsEmpty).toBe(true);
		expect(view.showChangesEmpty).toBe(false);
	});
});
