// Snapshots the installed OpenSpec CLI help into tests/fixtures/openspec-cli-<version>.json.
// The reference coherence test (tests/unit/cli-reference.test.ts) compares the docs against it.
// Usage: npm run snapshot:openspec   (re-run manually after upgrading OpenSpec)
import { execSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const CHAT_DIR = '.claude/commands/opsx';

const run = (args) => execSync(`openspec ${args}`, { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });

/** Lines of a commander help section ("Commands:" or "Options:"), without the header. */
function section(help, name) {
	const lines = help.split(/\r?\n/);
	const start = lines.findIndex((l) => l.trim() === `${name}:`);
	if (start === -1) return [];
	const out = [];
	for (const line of lines.slice(start + 1)) {
		if (line.trim() === '' || !line.startsWith(' ')) break;
		out.push(line);
	}
	return out;
}

/** Entry lines only (2-space indent), skipping wrapped description lines. */
const entries = (lines) => lines.filter((l) => /^ {2}\S/.test(l)).map((l) => l.trim().split(/\s{2,}/)[0]);

/** Command names, including aliases ("list|ls" → ["list", "ls"]). */
const commandsOf = (help) => entries(section(help, 'Commands')).flatMap((e) => e.split(' ')[0].split('|'));

/** Flags such as --strict, -y or --no-validate. */
const flagsOf = (help) =>
	entries(section(help, 'Options')).flatMap((e) => e.match(/(?<![\w-])--?[a-zA-Z][\w-]*/g) ?? []);

const version = run('--version').trim();
const root = run('--help');
const commands = {};

for (const cmd of commandsOf(root)) {
	if (cmd === 'help') {
		commands[cmd] = { subcommands: [], flags: [] };
		continue;
	}
	const help = run(`${cmd} --help`);
	// Any command whose help lists "Commands:" (change, spec, schema, store, workset...) has subcommands.
	const subcommands = commandsOf(help);
	commands[cmd] = { subcommands, flags: flagsOf(help) };
	for (const sub of subcommands) {
		if (sub === 'help' || sub === 'ls') continue; // help has no options; ls is an alias of list
		const subHelp = run(`${cmd} ${sub} --help`);
		commands[`${cmd} ${sub}`] = { subcommands: [], flags: flagsOf(subHelp) };
	}
}

const chatCommands = readdirSync(CHAT_DIR)
	.filter((f) => f.endsWith('.md'))
	.map((f) => `/opsx:${basename(f, '.md')}`)
	.sort();

const fixture = { version, globalFlags: flagsOf(root), commands, chatCommands };
const target = join('tests', 'fixtures', `openspec-cli-${version}.json`);
writeFileSync(target, `${JSON.stringify(fixture, null, '\t')}\n`);
console.log(`snapshot:openspec: wrote ${target} (${Object.keys(commands).length} commands)`);
