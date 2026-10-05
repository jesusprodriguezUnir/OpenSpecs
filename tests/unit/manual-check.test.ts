import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { checkManual, manualHash, manualText } from '../../scripts/manual-hash.mjs';

const page = (body: string) =>
	`<!doctype html><html><head><title>x</title><style>main{}</style></head><body><header>Cabecera</header><main data-x="1"><h1>Manual</h1>\n<p>Texto   de la   guía &amp; más</p><script>var a=1</script>${body}</main><footer>pie</footer></body></html>`;

function setup(html: string, hash?: string) {
	const dir = mkdtempSync(join(tmpdir(), 'manual-'));
	const htmlPath = join(dir, 'index.html');
	const hashPath = join(dir, 'manual.sha256');
	writeFileSync(htmlPath, html);
	if (hash !== undefined) writeFileSync(hashPath, `${hash}\n`);
	return { htmlPath, hashPath };
}

describe('calidad: manual PDF al día', () => {
	test('Scenario: PDF al día', () => {
		const html = page('<p>Uno</p>');
		expect(manualText(html)).toBe('Manual Texto de la guía & más Uno');
		const result = checkManual(setup(html, manualHash(html)));
		expect(result.ok).toBe(true);
		// Markup or whitespace outside the text does not change the fingerprint.
		expect(manualHash(page('<p class="y">Uno</p>\n\n'))).toBe(manualHash(html));
	});

	test('Scenario: PDF desfasado', () => {
		const committed = manualHash(page('<p>Uno</p>'));
		const result = checkManual(setup(page('<p>Uno cambiado</p>'), committed));
		expect(result.ok).toBe(false);
		expect(result.message).toContain('npm run manual:pdf');
	});

	test('Scenario: Huella ausente', () => {
		const result = checkManual(setup(page('<p>Uno</p>')));
		expect(result.ok).toBe(false);
		expect(result.message).toMatch(/Regenera el PDF/);
		expect(result.message).toContain('npm run manual:pdf');
	});
});
