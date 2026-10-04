import { describe, expect, test } from 'vitest';
import {
	buildBreadcrumbs,
	buildTechArticle,
	sidebarSection,
	jsonLdEntry,
	ogImageUrl,
	robotsTxt,
	upsertHead,
	type HeadEntry,
} from '../../src/lib/seo';

const SITE = 'https://example.org';

describe('seo: imagen Open Graph', () => {
	test('Scenario: Imagen de sección en una guía', () => {
		expect(ogImageUrl(SITE, '/guias/formato-de-specs/')).toBe('https://example.org/og/guias.png');
	});

	test('Scenario: Imagen por defecto sin sección', () => {
		expect(ogImageUrl(SITE, '/')).toMatch(/\/og\/default\.png$/);
		expect(ogImageUrl(SITE, '/404/')).toMatch(/\/og\/default\.png$/);
		expect(ogImageUrl(SITE, '/sin-imagen/pagina/')).toMatch(/\/og\/default\.png$/);
	});
});

describe('seo: JSON-LD', () => {
	test('Scenario: TechArticle con dateModified de lastReviewed', () => {
		const article = buildTechArticle({
			headline: 'Formato de specs',
			description: 'Descripción',
			url: `${SITE}/guias/formato-de-specs/`,
			lastReviewed: new Date('2026-09-15'),
		});
		expect(article['@type']).toBe('TechArticle');
		expect(article.dateModified).toBe('2026-09-15');
		expect(article.inLanguage).toBe('es-ES');
		expect(article).not.toHaveProperty('datePublished');
	});

	test('Scenario: Migas de una guía', () => {
		const list = buildBreadcrumbs(SITE, '/guias/formato-de-specs/', {
			section: 'Guías',
			sectionHref: '/guias/flujo-opsx/',
			page: 'Formato de specs',
		}) as { itemListElement: { position: number; name: string; item: string }[] };
		expect(list.itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://example.org/' },
			{ '@type': 'ListItem', position: 2, name: 'Guías', item: 'https://example.org/guias/flujo-opsx/' },
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Formato de specs',
				item: 'https://example.org/guias/formato-de-specs/',
			},
		]);
	});

	test('Scenario: Migas de una página de primer nivel', () => {
		const list = buildBreadcrumbs(SITE, '/recursos/', { section: 'Recursos', sectionHref: '/recursos/', page: 'Recursos' }) as {
			itemListElement: { position: number; name: string }[];
		};
		expect(list.itemListElement.map((i) => [i.position, i.name])).toEqual([
			[1, 'Inicio'],
			[2, 'Recursos'],
		]);
	});

	test('Scenario: Migas de una guía: sección desde la navegación lateral', () => {
		const sidebar = [
			{ type: 'group' as const, label: 'Empieza', entries: [{ type: 'link' as const, label: 'A', href: '/empieza/que-es/' }] },
			{
				type: 'group' as const,
				label: 'Guías',
				entries: [
					{ type: 'link' as const, label: 'Flujo', href: '/guias/flujo-opsx/' },
					{ type: 'link' as const, label: 'Formato', href: '/guias/formato-de-specs/' },
				],
			},
		];
		expect(sidebarSection(sidebar, '/guias/formato-de-specs/')).toEqual({ label: 'Guías', firstHref: '/guias/flujo-opsx/' });
		expect(sidebarSection(sidebar, '/no-existe/')).toBeUndefined();
	});

	test('JSON-LD escapa "<" para no cerrar el script', () => {
		const entry = jsonLdEntry({ name: '</script><b>' });
		expect(entry.content).not.toContain('<');
		expect(JSON.parse(entry.content!)).toEqual({ name: '</script><b>' });
	});
});

describe('seo: robots.txt', () => {
	test('Scenario: Sitemap con SITE_URL definida', () => {
		const robots = robotsTxt(SITE);
		expect(robots).toContain('User-agent: *');
		expect(robots).toContain('Allow: /');
		expect(robots).toContain('Sitemap: https://example.org/sitemap-index.xml');
	});
});

describe('seo: upsertHead', () => {
	const head: HeadEntry[] = [
		{ tag: 'title', content: 'T' },
		{ tag: 'meta', attrs: { property: 'og:type', content: 'article' } },
	];

	test('sustituye og:type existente', () => {
		const result = upsertHead(head, { tag: 'meta', attrs: { property: 'og:type', content: 'website' } });
		expect(result).toHaveLength(2);
		expect(result[1]!.attrs!.content).toBe('website');
	});

	test('añade twitter:card ausente', () => {
		const result = upsertHead(head, {
			tag: 'meta',
			attrs: { name: 'twitter:card', content: 'summary_large_image' },
		});
		expect(result).toHaveLength(3);
	});

	test('no duplica al aplicar dos veces', () => {
		const entry: HeadEntry = { tag: 'meta', attrs: { property: 'og:image', content: 'x' } };
		const result = upsertHead(upsertHead(head, entry), entry);
		expect(result.filter((e) => e.attrs?.property === 'og:image')).toHaveLength(1);
	});

	test('los JSON-LD siempre se añaden', () => {
		const ld = jsonLdEntry({ '@type': 'WebSite' });
		expect(upsertHead(upsertHead(head, ld), ld)).toHaveLength(4);
	});
});
