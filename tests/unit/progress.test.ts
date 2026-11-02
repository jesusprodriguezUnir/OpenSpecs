import { describe, expect, it } from 'vitest';
import { progressInGroup, type SidebarItem } from '../../src/lib/progress';

const link = (href: string) => ({ type: 'link' as const, label: href, href });
const sidebar: SidebarItem[] = [
	{
		type: 'group',
		label: 'Empieza',
		entries: [link('/empieza/que-es/'), link('/empieza/conceptos/'), link('/empieza/instalacion/')],
	},
	{ type: 'group', label: 'Recursos', entries: [link('/recursos/'), link('/manual-openspec.pdf')] },
	{
		type: 'group',
		label: 'Guías',
		entries: [link('/guias/a/'), { type: 'group', label: 'Más', entries: [link('/guias/b/')] }],
	},
];

describe('progressInGroup', () => {
	it('primera página del grupo', () => {
		expect(progressInGroup(sidebar, '/empieza/que-es/')).toEqual({ group: 'Empieza', index: 1, total: 3 });
	});

	it('última página del grupo, con o sin barra final', () => {
		expect(progressInGroup(sidebar, '/empieza/instalacion')).toEqual({ group: 'Empieza', index: 3, total: 3 });
	});

	it('grupo con una sola página (el PDF no cuenta) devuelve null', () => {
		expect(progressInGroup(sidebar, '/recursos/')).toBeNull();
	});

	it('página fuera del sidebar devuelve null', () => {
		expect(progressInGroup(sidebar, '/')).toBeNull();
		expect(progressInGroup(sidebar, '/no-existe/')).toBeNull();
	});

	it('aplana subgrupos en orden', () => {
		expect(progressInGroup(sidebar, '/guias/b/')).toEqual({ group: 'Guías', index: 2, total: 2 });
	});
});
