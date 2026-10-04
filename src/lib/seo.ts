/** Pure SEO helpers: Open Graph image URLs, JSON-LD builders, robots.txt and head deduplication. */

export const SITE_NAME = 'OpenSpec desde cero';
export const SITE_LANG = 'es-ES';
export const OG_LOCALE = 'es_ES';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Sections whose PNG exists in `public/og/`; any other path uses `default.png`. */
export const OG_SECTIONS = [
	'empieza',
	'guias',
	'agentes',
	'equipo',
	'referencia',
	'recursos',
	'como-se-hizo',
] as const;

/** Human-readable section names used for the Open Graph image alt text. */
export const SECTION_TITLES: Record<string, string> = {
	empieza: 'Empieza',
	guias: 'Guías',
	agentes: 'Con tu agente',
	equipo: 'En equipo',
	referencia: 'Referencia',
	recursos: 'Recursos',
	'como-se-hizo': 'Cómo se hizo',
};

/** Sections whose pages are technical articles (guides and reference). */
export const ARTICLE_SECTIONS: readonly string[] = ['empieza', 'guias', 'agentes', 'equipo', 'referencia'];

export type HeadEntry = {
	tag: 'link' | 'style' | 'title' | 'base' | 'meta' | 'script' | 'noscript' | 'template';
	attrs?: Record<string, string | boolean | undefined>;
	content?: string;
};

type JsonLd = Record<string, unknown>;

function segmentsOf(pathname: string): string[] {
	return pathname.split('/').filter(Boolean);
}

/** First path segment, or an empty string for the landing. */
export function sectionOfPath(pathname: string): string {
	return segmentsOf(pathname)[0] ?? '';
}

function absolute(site: URL | string, pathname: string): string {
	return new URL(pathname, site).href;
}

/** Origin of the site without a trailing slash, e.g. `https://example.org`. */
function originOf(site: URL | string): string {
	return absolute(site, '/').replace(/\/$/, '');
}

/** Absolute Open Graph image URL for the page at `pathname`. */
export function ogImageUrl(site: URL | string, pathname: string): string {
	const section = sectionOfPath(pathname);
	const name = (OG_SECTIONS as readonly string[]).includes(section) ? section : 'default';
	return absolute(site, `/og/${name}.png`);
}

/** Alt text of the Open Graph image for the page at `pathname`. */
export function ogImageAlt(pathname: string): string {
	const title = SECTION_TITLES[sectionOfPath(pathname)];
	return title ? `${SITE_NAME} · ${title}` : SITE_NAME;
}

export function buildWebSite(site: URL | string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: originOf(site),
		inLanguage: SITE_LANG,
	};
}

export type TechArticleInput = {
	headline: string;
	description: string | undefined;
	url: string;
	lastReviewed: Date | string;
};

/** `YYYY-MM-DD` in UTC, matching how YAML dates in frontmatter are parsed. */
function isoDate(value: Date | string): string {
	return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

export function buildTechArticle({ headline, description, url, lastReviewed }: TechArticleInput): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline,
		...(description ? { description } : {}),
		url,
		inLanguage: SITE_LANG,
		dateModified: isoDate(lastReviewed),
	};
}

export type BreadcrumbTitles = {
	/** Section label in the sidebar. */
	section: string;
	/** Href of the first page of the section in sidebar order. */
	sectionHref: string;
	/** Title of the current page. */
	page: string;
};

/** Minimal shape of Starlight's computed sidebar (`starlightRoute.sidebar`). */
export type SidebarNode =
	| { type: 'link'; label: string; href: string }
	| { type: 'group'; label: string; entries: SidebarNode[] };

function firstLink(entries: SidebarNode[]): string | undefined {
	for (const entry of entries) {
		const href = entry.type === 'link' ? entry.href : firstLink(entry.entries);
		if (href) return href;
	}
	return undefined;
}

function containsHref(entries: SidebarNode[], href: string): boolean {
	return entries.some((e) => (e.type === 'link' ? e.href === href : containsHref(e.entries, href)));
}

/** Label and first page (sidebar order) of the top-level sidebar group that contains `pathname`. */
export function sidebarSection(
	sidebar: SidebarNode[],
	pathname: string,
): { label: string; firstHref: string } | undefined {
	for (const entry of sidebar) {
		if (entry.type !== 'group' || !containsHref(entry.entries, pathname)) continue;
		const firstHref = firstLink(entry.entries);
		if (firstHref) return { label: entry.label, firstHref };
	}
	return undefined;
}

/**
 * Inicio → section → page. Top-level pages (and section indexes) end at the section level,
 * where the element is the page itself.
 */
export function buildBreadcrumbs(site: URL | string, pathname: string, titles: BreadcrumbTitles): JsonLd {
	const segments = segmentsOf(pathname);
	const crumbs: { name: string; item: string }[] = [{ name: 'Inicio', item: absolute(site, '/') }];
	if (segments.length === 1) {
		crumbs.push({ name: titles.page, item: absolute(site, pathname) });
	} else if (segments.length > 1) {
		crumbs.push({ name: titles.section, item: absolute(site, titles.sectionHref) });
		crumbs.push({ name: titles.page, item: absolute(site, pathname) });
	}
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.item,
		})),
	};
}

export function robotsTxt(site: URL | string): string {
	return `User-agent: *\nAllow: /\n\nSitemap: ${absolute(site, '/sitemap-index.xml')}\n`;
}

/** Serialises JSON-LD for an inline script, escaping `<` so the content cannot close the tag. */
export function jsonLdEntry(data: JsonLd): HeadEntry {
	return {
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: JSON.stringify(data).replace(/</g, '\\u003c'),
	};
}

function keyOf(entry: HeadEntry): string | undefined {
	if (entry.tag !== 'meta') return undefined;
	const { property, name } = entry.attrs ?? {};
	if (typeof property === 'string') return `property:${property}`;
	if (typeof name === 'string') return `name:${name}`;
	return undefined;
}

/**
 * Replaces the meta entry with the same `property`/`name`, or appends it when absent.
 * Entries without such a key (e.g. JSON-LD scripts) are always appended.
 */
export function upsertHead(head: HeadEntry[], entry: HeadEntry): HeadEntry[] {
	const key = keyOf(entry);
	if (key === undefined) return [...head, entry];
	const index = head.findIndex((existing) => keyOf(existing) === key);
	if (index === -1) return [...head, entry];
	return head.map((existing, i) => (i === index ? entry : existing));
}
