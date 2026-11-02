import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AA_NORMAL_TEXT, contrastRatio, hexToRgb } from '../../src/lib/contrast';
import { DELTA_TAGS, DELTA_TAG_TOKENS, TEXT_PAIRS, THEME_TOKENS, type Theme } from '../../src/lib/design-tokens';

const THEMES: Theme[] = ['light', 'dark'];

/** Custom properties declared in the first block that matches `selector` in custom.css. */
function declaredTokens(css: string, selector: string): Record<string, string> {
	const start = css.indexOf(`${selector} {`);
	if (start === -1) throw new Error(`No se encontró el bloque ${selector} en custom.css`);
	const block = css.slice(start, css.indexOf('}', start));
	const tokens: Record<string, string> = {};
	for (const [, name, value] of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) tokens[name] = value.trim();
	return tokens;
}

describe('contraste WCAG', () => {
	it('calcula los extremos conocidos', () => {
		expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
		expect(contrastRatio('#777', '#777')).toBe(1);
		expect(hexToRgb('#abc')).toEqual([0xaa, 0xbb, 0xcc]);
		expect(() => hexToRgb('azul')).toThrow();
	});

	for (const theme of THEMES) {
		describe(`tema ${theme === 'light' ? 'claro' : 'oscuro'}`, () => {
			const tokens = THEME_TOKENS[theme];

			for (const [text, background] of TEXT_PAIRS[theme]) {
				it(`${text} sobre ${background} alcanza AA`, () => {
					expect(contrastRatio(tokens[text], tokens[background])).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
				});
			}

			for (const tag of DELTA_TAGS) {
				it(`etiqueta ${tag.toUpperCase()} alcanza AA`, () => {
					const { bg, text } = DELTA_TAG_TOKENS[theme][tag];
					expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
				});
			}
		});
	}
});

describe('custom.css declara la tabla de tokens', () => {
	const css = readFileSync(new URL('../../src/styles/custom.css', import.meta.url), 'utf8');
	const selectors: Record<Theme, string> = { dark: ':root', light: ":root[data-theme='light']" };

	for (const theme of THEMES) {
		it(`los valores del tema ${theme === 'light' ? 'claro' : 'oscuro'} coinciden`, () => {
			const declared = declaredTokens(css, selectors[theme]);
			const expected: Record<string, string> = { ...THEME_TOKENS[theme] };
			for (const tag of DELTA_TAGS) {
				expected[`--os-tag-${tag}-bg`] = DELTA_TAG_TOKENS[theme][tag].bg;
				expected[`--os-tag-${tag}-text`] = DELTA_TAG_TOKENS[theme][tag].text;
			}
			for (const [name, value] of Object.entries(expected)) {
				expect(declared[name]?.toUpperCase(), name).toBe(value.toUpperCase());
			}
		});
	}
});
