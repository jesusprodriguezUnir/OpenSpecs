/** WCAG 2.x contrast helpers (relative luminance and contrast ratio), pure and dependency-free. */

/** Parses `#RGB` or `#RRGGBB` into 0–255 channels. */
export function hexToRgb(hex: string): [number, number, number] {
	const value = hex.trim().replace(/^#/, '');
	const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
	if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Color hexadecimal inválido: ${hex}`);
	return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

/** Relative luminance as defined by WCAG 2.x (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
	const [r, g, b] = hexToRgb(hex).map((channel) => {
		const c = channel / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colors, from 1 to 21; order does not matter. */
export function contrastRatio(a: string, b: string): number {
	const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** Minimum ratio for normal-size text at level AA. */
export const AA_NORMAL_TEXT = 4.5;
