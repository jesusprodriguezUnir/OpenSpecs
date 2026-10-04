import { z } from 'astro/zod';

export const RESOURCE_TYPES = ['oficial', 'comunidad', 'video'] as const;
export const RESOURCE_LANGS = ['es', 'en'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

/** Visible label of each resource type on /recursos/. */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
	oficial: 'Oficial',
	comunidad: 'Comunidad',
	video: 'Vídeo',
};

/** Schema of one entry of the `resources` collection (src/data/resources.yaml). */
export const resourceSchema = z.object({
	title: z.string().min(1),
	url: z.url({ protocol: /^https$/, message: 'url debe ser una URL absoluta con esquema https' }),
	type: z.enum(RESOURCE_TYPES),
	lang: z.enum(RESOURCE_LANGS),
});

export type Resource = z.infer<typeof resourceSchema>;
