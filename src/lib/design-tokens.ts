/**
 * Color tokens of the site (w18, design.md D1) as data. `src/styles/custom.css` declares the same
 * values; tests/unit/contrast.test.ts checks both that they match and that every text/background
 * pair reaches WCAG AA.
 */
export type Theme = 'light' | 'dark';

/** CSS custom property → hex value, per theme. */
export type TokenTable = Record<string, string>;

export const THEME_TOKENS: Record<Theme, TokenTable> = {
	light: {
		'--sl-color-black': '#FAFAF7',
		'--sl-color-white': '#16181D',
		'--sl-color-gray-1': '#24262C',
		'--sl-color-gray-2': '#3D414C',
		'--sl-color-gray-3': '#5B5F69',
		'--sl-color-gray-4': '#8A8D96',
		'--sl-color-gray-5': '#D5D7CF',
		'--sl-color-gray-6': '#E3E4DE',
		'--sl-color-gray-7': '#FFFFFF',
		'--sl-color-accent': '#3338C9',
		'--sl-color-accent-high': '#1F2390',
		'--sl-color-accent-low': '#EEEFF9',
		'--os-surface': '#FFFFFF',
		'--os-border': '#E3E4DE',
		'--os-band-bg': '#16181D',
		'--os-band-text': '#FAFAF7',
		'--os-band-muted': '#9EA2AD',
		'--os-band-accent': '#C7C9FF',
	},
	dark: {
		'--sl-color-black': '#121317',
		'--sl-color-white': '#ECEDEF',
		'--sl-color-gray-1': '#DADCE0',
		'--sl-color-gray-2': '#C3C6CD',
		'--sl-color-gray-3': '#A3A7B1',
		'--sl-color-gray-4': '#6F737D',
		'--sl-color-gray-5': '#3E424B',
		'--sl-color-gray-6': '#2E3139',
		'--sl-color-gray-7': '#1A1C21',
		'--sl-color-accent': '#A5A9FF',
		'--sl-color-accent-high': '#C7C9FF',
		'--sl-color-accent-low': '#1E2150',
		'--os-surface': '#1A1C21',
		'--os-border': '#2E3139',
		'--os-band-bg': '#1A1C21',
		'--os-band-text': '#ECEDEF',
		'--os-band-muted': '#A3A7B1',
		'--os-band-accent': '#C7C9FF',
	},
};

export const DELTA_TAGS = ['added', 'modified', 'removed', 'renamed'] as const;
export type DeltaTag = (typeof DELTA_TAGS)[number];

/** Background and text of each delta label (`--os-tag-<name>-bg` / `--os-tag-<name>-text`). */
export const DELTA_TAG_TOKENS: Record<Theme, Record<DeltaTag, { bg: string; text: string }>> = {
	light: {
		added: { bg: '#EEF7F1', text: '#17603C' },
		modified: { bg: '#FBF3E6', text: '#7A4800' },
		removed: { bg: '#FCEEEC', text: '#9B1C12' },
		renamed: { bg: '#EEEFF9', text: '#2A2E9E' },
	},
	dark: {
		added: { bg: '#12301F', text: '#8FD4AE' },
		modified: { bg: '#33260F', text: '#F0C67A' },
		removed: { bg: '#3A1612', text: '#F4A69C' },
		renamed: { bg: '#1E2150', text: '#C3C6FF' },
	},
};

/**
 * Text/background pairs that carry readable text, by token name. Starlight uses gray-2 as body
 * text, accent-high (dark) or accent (light) for links, and the accent as background of the
 * current sidebar link.
 */
export const TEXT_PAIRS: Record<Theme, readonly [text: string, background: string][]> = {
	light: [
		['--sl-color-white', '--sl-color-black'],
		['--sl-color-white', '--os-surface'],
		['--sl-color-white', '--sl-color-gray-6'],
		['--sl-color-gray-2', '--sl-color-black'],
		['--sl-color-gray-3', '--sl-color-black'],
		['--sl-color-gray-3', '--os-surface'],
		['--sl-color-gray-3', '--sl-color-accent-low'],
		['--sl-color-accent', '--sl-color-black'],
		['--sl-color-accent', '--os-surface'],
		['--sl-color-accent', '--sl-color-accent-low'],
		['--sl-color-accent-high', '--sl-color-black'],
		['--sl-color-black', '--sl-color-accent'],
		['--os-band-text', '--os-band-bg'],
		['--os-band-muted', '--os-band-bg'],
		['--os-band-accent', '--os-band-bg'],
	],
	dark: [
		['--sl-color-white', '--sl-color-black'],
		['--sl-color-white', '--os-surface'],
		['--sl-color-white', '--sl-color-gray-6'],
		['--sl-color-gray-2', '--sl-color-black'],
		['--sl-color-gray-3', '--sl-color-black'],
		['--sl-color-gray-3', '--os-surface'],
		['--sl-color-gray-3', '--sl-color-accent-low'],
		['--sl-color-accent', '--sl-color-black'],
		['--sl-color-accent-high', '--sl-color-black'],
		['--sl-color-accent-high', '--os-surface'],
		['--sl-color-accent-high', '--sl-color-accent-low'],
		['--sl-color-accent-low', '--sl-color-accent-high'],
		['--os-band-text', '--os-band-bg'],
		['--os-band-muted', '--os-band-bg'],
		['--os-band-accent', '--os-band-bg'],
	],
};
