import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { FALLBACK_SITE_URL } from './config/site.mjs';
import {
	ARTICLE_SECTIONS,
	OG_IMAGE_HEIGHT,
	OG_IMAGE_WIDTH,
	OG_LOCALE,
	buildBreadcrumbs,
	buildTechArticle,
	buildWebSite,
	jsonLdEntry,
	ogImageAlt,
	ogImageUrl,
	sectionOfPath,
	sidebarSection,
	upsertHead,
	type HeadEntry,
} from './lib/seo';

/**
 * Completes Starlight's head with Open Graph, Twitter and JSON-LD. Tags Starlight already emits
 * (og:type, og:locale, twitter:card…) are replaced by property/name instead of duplicated.
 */
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const site = context.site ?? FALLBACK_SITE_URL;
	const { pathname } = context.url;
	const isLanding = sectionOfPath(pathname) === '';
	const is404 = route.id === '404';
	const imagePath = is404 ? '/' : pathname;
	const canonicalLink = route.head.find((e) => e.tag === 'link' && e.attrs?.rel === 'canonical');
	const canonical =
		typeof canonicalLink?.attrs?.href === 'string' ? canonicalLink.attrs.href : new URL(pathname, site).href;
	const { data } = route.entry;

	const metas: HeadEntry[] = [
		{ tag: 'meta', attrs: { property: 'og:type', content: isLanding ? 'website' : 'article' } },
		{ tag: 'meta', attrs: { property: 'og:url', content: canonical } },
		{ tag: 'meta', attrs: { property: 'og:locale', content: OG_LOCALE } },
		{ tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl(site, imagePath) } },
		{ tag: 'meta', attrs: { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) } },
		{ tag: 'meta', attrs: { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) } },
		{ tag: 'meta', attrs: { property: 'og:image:alt', content: ogImageAlt(imagePath) } },
		{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
	];
	let head: HeadEntry[] = route.head;
	for (const meta of metas) head = upsertHead(head, meta);

	if (isLanding) {
		head = upsertHead(head, jsonLdEntry(buildWebSite(site)));
	} else if (!is404) {
		const section = sectionOfPath(pathname);
		if (ARTICLE_SECTIONS.includes(section) && data.lastReviewed) {
			head = upsertHead(
				head,
				jsonLdEntry(
					buildTechArticle({
						headline: data.title,
						description: data.description,
						url: canonical,
						lastReviewed: data.lastReviewed,
					}),
				),
			);
		}
		// Section crumb: sidebar group label and its first page in sidebar order (no /<section>/ index exists).
		const group = sidebarSection(route.sidebar, pathname);
		if (group) {
			head = upsertHead(
				head,
				jsonLdEntry(
					buildBreadcrumbs(site, pathname, {
						section: group.label,
						sectionHref: group.firstHref,
						page: data.title,
					}),
				),
			);
		}
	}
	route.head = head;
});
