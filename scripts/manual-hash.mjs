// Fingerprint of the printable manual: SHA-256 of the normalized text of <main> in the built /manual/.
// The PDF itself is not byte-reproducible, so CI compares this text hash instead (w14).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

export const MANUAL_HTML = 'dist/manual/index.html';
export const MANUAL_HASH = 'public/manual-openspec.sha256';
export const REGENERATE_COMMAND = 'npm run manual:pdf';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Text of the first <main> element: no scripts, styles or tags, entities decoded, whitespace collapsed. */
export function manualText(html) {
	const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
	if (!main) throw new Error('No se encontró <main> en el HTML del manual.');
	return main[1]
		.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
			if (code[0] === '#') {
				const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
				return String.fromCodePoint(n);
			}
			return ENTITIES[code.toLowerCase()] ?? whole;
		})
		.replace(/\s+/g, ' ')
		.trim();
}

/** Hex SHA-256 of the manual text. */
export function manualHash(html) {
	return createHash('sha256').update(manualText(html), 'utf8').digest('hex');
}

/**
 * Compares the hash of the built manual with the committed one.
 * @returns {{ ok: boolean, message: string }}
 */
export function checkManual({ htmlPath = MANUAL_HTML, hashPath = MANUAL_HASH } = {}) {
	if (!existsSync(htmlPath)) {
		return { ok: false, message: `No existe ${htmlPath}: ejecuta npm run build antes de la comprobación.` };
	}
	if (!existsSync(hashPath)) {
		return {
			ok: false,
			message: `No existe la huella ${hashPath}. Regenera el PDF con \`${REGENERATE_COMMAND}\` y commitea el resultado.`,
		};
	}
	const expected = readFileSync(hashPath, 'utf8').trim();
	const actual = manualHash(readFileSync(htmlPath, 'utf8'));
	if (expected !== actual) {
		return {
			ok: false,
			message: `El PDF del manual está desfasado respecto al contenido (huella ${actual}, versionada ${expected}). Ejecuta \`${REGENERATE_COMMAND}\` y commitea public/manual-openspec.pdf, ${hashPath} y src/data/manual.json.`,
		};
	}
	return { ok: true, message: `Manual PDF al día (huella ${actual}).` };
}
