// Checks internal links (including #fragments) in a built site. External links are not checked.
// Usage: node scripts/links.mjs [dir]   (default: dist)
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? 'dist');

if (!existsSync(dir)) {
	console.error(`links: "${dir}" does not exist. Run "npm run build" first.`);
	process.exit(2);
}

const result = spawnSync(
	'lychee',
	['--offline', '--include-fragments', '--no-progress', '--root-dir', dir, dir],
	{ stdio: 'inherit' },
);

if (result.error?.code === 'ENOENT') {
	console.error('links: lychee is not installed. See the "Comprobar enlaces" section in README.md.');
	process.exit(2);
}

process.exit(result.status ?? 1);
