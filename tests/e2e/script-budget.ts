// A page script identified by its src (external) or its trimmed content (inline).
export type ScriptRef = { src: string | null; content: string; type?: string | null };

const keyOf = (s: ScriptRef) => (s.src ? `src:${s.src}` : `inline:${s.content.trim()}`);

// Scripts loaded by the landing that a regular guide page does not load.
export function scriptExtras(landing: ScriptRef[], guide: ScriptRef[]): string[] {
	const allowed = new Set(guide.map(keyOf));
	return landing.map(keyOf).filter((key) => !allowed.has(key));
}

// Drops JSON-LD blocks: structured data is not executable JavaScript.
export function executableScripts(scripts: ScriptRef[]): ScriptRef[] {
	return scripts.filter((s) => s.type !== 'application/ld+json');
}
