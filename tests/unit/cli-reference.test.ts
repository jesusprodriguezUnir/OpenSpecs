import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { checkChatPage, checkCliPage, type CliFixture } from '../../src/lib/cli-reference';

const fixture = JSON.parse(readFileSync('tests/fixtures/openspec-cli-1.14.0.json', 'utf8')) as CliFixture;
const read = (path: string) => readFileSync(path, 'utf8');

const page = (body: string, version = fixture.version) =>
	`---\ntitle: "CLI"\nopenspecVersion: "${version}"\nlastReviewed: 2026-10-04\n---\n\n${body}\n`;

describe('contenido: referencia coherente con la CLI fijada', () => {
	test('Scenario: Comando inexistente en la referencia CLI', () => {
		const issues = checkCliPage(page('Despliega con `openspec deploy`.'), fixture);
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/"deploy"/);
	});

	test('Scenario: Flag inexistente en la referencia CLI', () => {
		const issues = checkCliPage(page('```bash\nopenspec archive reservas --force-all\n```'), fixture);
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/"--force-all".*"archive"/);
	});

	test('Scenario: Comando de chat inexistente', () => {
		const issues = checkChatPage(page('Usa `/opsx:proposal` para empezar.'), fixture);
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/\/opsx:proposal/);
	});

	test('Scenario: Versión de la fixture distinta de la página', () => {
		const issues = checkCliPage(page('`openspec list`', '1.15.0'), fixture);
		expect(issues).toHaveLength(1);
		expect(issues[0]).toMatch(/1\.15\.0/);
		expect(issues[0]).toMatch(/1\.14\.0/);
	});

	test('valid usages pass: subcommands, positional args, global and subcommand flags', () => {
		const body = [
			'```bash',
			'openspec --version',
			'openspec validate --all --strict --no-interactive  # CI',
			'openspec change show reservas --json --deltas-only',
			'openspec config set telemetry.enabled false && openspec list --specs',
			'```',
			'Ruta `openspec/specs/` e instalación con `npm i -g @fission-ai/openspec@1.14.0`.',
		].join('\n');
		expect(checkCliPage(page(body), fixture)).toEqual([]);
	});

	test('the real reference pages match the fixture', () => {
		expect(checkCliPage(read('src/content/docs/referencia/cli.mdx'), fixture)).toEqual([]);
		expect(checkChatPage(read('src/content/docs/referencia/comandos-chat.mdx'), fixture)).toEqual([]);
	});
});
