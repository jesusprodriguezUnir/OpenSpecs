/**
 * Position of the current page inside its top-level sidebar group (w18, design.md D6), from
 * `Astro.locals.starlightRoute.sidebar`. Only page links count: a group's file links (such as
 * the manual PDF) are not steps.
 */
export type SidebarLink = { type: 'link'; label: string; href: string; isCurrent?: boolean };
export type SidebarGroup = { type: 'group'; label: string; entries: readonly SidebarItem[] };
export type SidebarItem = SidebarLink | SidebarGroup;

export type GroupProgress = { group: string; index: number; total: number };

const normalize = (href: string) => (href.endsWith('/') ? href : `${href}/`);

/** Links of a group (nested groups flattened, in order) that point at site pages. */
function pageLinks(entries: readonly SidebarItem[]): SidebarLink[] {
	return entries.flatMap((e) => (e.type === 'group' ? pageLinks(e.entries) : e.href.endsWith('/') ? [e] : []));
}

/**
 * `{ group, index, total }` with a 1-based index, or `null` when the page is in no top-level
 * group or its group has fewer than two pages.
 */
export function progressInGroup(sidebar: readonly SidebarItem[], currentHref: string): GroupProgress | null {
	const current = normalize(currentHref);
	for (const item of sidebar) {
		if (item.type !== 'group') continue;
		const links = pageLinks(item.entries);
		const position = links.findIndex((l) => normalize(l.href) === current);
		if (position === -1) continue;
		return links.length < 2 ? null : { group: item.label, index: position + 1, total: links.length };
	}
	return null;
}
