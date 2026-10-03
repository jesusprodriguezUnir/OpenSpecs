import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

type Header = { key: string; value: string };
type Redirect = { source: string; destination: string; permanent?: boolean; statusCode?: number };
type VercelConfig = {
	buildCommand: string;
	outputDirectory: string;
	functions?: unknown;
	redirects: Redirect[];
	headers: { source: string; headers: Header[] }[];
};

const config: VercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
const fixtureDist = resolve('tests/unit/fixtures/vercel/dist');

const headersFor = (source: string) =>
	Object.fromEntries(
		(config.headers.find((h) => h.source === source)?.headers ?? []).map((h) => [h.key, h.value]),
	);
const globalHeaders = headersFor('/(.*)');
const csp = globalHeaders['Content-Security-Policy'] ?? '';
const hsts = globalHeaders['Strict-Transport-Security'] ?? '';

const isPermanent = (r: Redirect) =>
	r.statusCode === undefined ? r.permanent !== false : r.statusCode === 308 || r.statusCode === 301;

/** Returns the redirects whose destination does not exist in the given build output. */
function findInvalidRedirects(redirects: Redirect[], distDir: string): Redirect[] {
	return redirects.filter((r) => {
		if (/^https?:\/\//.test(r.destination)) return false;
		const path = r.destination.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
		return !existsSync(join(distDir, path, 'index.html')) && !existsSync(join(distDir, path));
	});
}

describe('despliegue: configuración de Vercel', () => {
	test('Scenario: Configuración de build estática', () => {
		expect(config.buildCommand).toBe('npm run build');
		expect(config.outputDirectory).toBe('dist');
		expect(config.functions).toBeUndefined();
	});

	test('Scenario: CSP sin orígenes de terceros', () => {
		const allowedSchemes: Record<string, string[]> = {
			'img-src': ['data:'],
			'font-src': ['data:'],
			'worker-src': ['blob:'],
		};
		for (const directive of csp.split(';').map((d) => d.trim()).filter(Boolean)) {
			const [name, ...sources] = directive.split(/\s+/);
			for (const source of sources) {
				const isKeyword = /^'[a-z-]+'$/.test(source);
				const isAllowedScheme = (allowedSchemes[name] ?? []).includes(source);
				expect(isKeyword || isAllowedScheme, `${name} ${source}`).toBe(true);
			}
		}
	});

	test('Scenario: CSP impide el embebido', () => {
		expect(csp).toContain("frame-ancestors 'none'");
		expect(csp).toContain("object-src 'none'");
		expect(csp).toContain("base-uri 'self'");
	});

	test('Scenario: HSTS con max-age suficiente', () => {
		const maxAge = Number(hsts.match(/max-age=(\d+)/)?.[1]);
		expect(maxAge).toBeGreaterThanOrEqual(31536000);
		expect(hsts).toContain('includeSubDomains');
	});

	test('Scenario: HSTS sin preload', () => {
		expect(hsts).not.toMatch(/preload/i);
	});

	test('Scenario: Recursos con hash inmutables', () => {
		expect(headersFor('/_astro/(.*)')['Cache-Control']).toBe('public, max-age=31536000, immutable');
		expect(globalHeaders['Cache-Control'] ?? '').not.toContain('immutable');
	});

	test('Scenario: Redirecciones permanentes', () => {
		expect(config.redirects.filter((r) => !isPermanent(r))).toEqual([]);
		expect(isPermanent({ source: '/a', destination: '/b', permanent: false })).toBe(false);
	});

	test('Scenario: Redirección con destino inexistente', () => {
		const redirects = [
			{ source: '/antes', destination: '/existe/' },
			{ source: '/roto', destination: '/no-existe/' },
		];
		expect(findInvalidRedirects(redirects, fixtureDist)).toEqual([redirects[1]]);
	});

	test('Scenario: Sin redirecciones declaradas', () => {
		expect(findInvalidRedirects([], fixtureDist)).toEqual([]);
		expect(findInvalidRedirects(config.redirects, resolve('dist'))).toEqual([]);
	});
});
