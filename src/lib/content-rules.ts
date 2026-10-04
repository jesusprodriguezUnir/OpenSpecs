import { z } from 'astro/zod';

/** Metadata fields that guide pages may be required to declare. */
export type GuideField = 'openspecVersion' | 'lastReviewed' | 'level' | 'duration' | 'description';

/** Inclusive length bounds for `description` in guide and reference sections. */
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 160;

export const GUIDE_LEVELS = ['inicio', 'intermedio', 'avanzado'] as const;
export type GuideLevel = (typeof GUIDE_LEVELS)[number];

const GUIDE_SECTIONS: readonly string[] = ['empieza', 'guias', 'agentes', 'equipo'];
const REFERENCE_SECTION = 'referencia';

/** Schema extension for the `docs` collection. Fields are optional here; section rules live in `requiredFieldsFor`. */
export const guideMetadataSchema = z.object({
	openspecVersion: z
		.string()
		.regex(/^\d+\.\d+(\.\d+)?$/, 'openspecVersion debe tener formato X.Y o X.Y.Z')
		.optional(),
	lastReviewed: z.coerce.date().optional(),
	level: z.enum(GUIDE_LEVELS).optional(),
	duration: z.number().int().positive().optional(),
});

export type GuideMetadata = z.infer<typeof guideMetadataSchema>;

function sectionOf(id: string): string {
	return id.replace(/^\/+/, '').split('/')[0] ?? '';
}

/** Fields that the page with the given collection id (e.g. `guias/recetas`) must declare. */
export function requiredFieldsFor(id: string): GuideField[] {
	const section = sectionOf(id);
	if (GUIDE_SECTIONS.includes(section)) return ['openspecVersion', 'lastReviewed', 'level', 'description'];
	if (section === REFERENCE_SECTION) return ['openspecVersion', 'lastReviewed', 'description'];
	return [];
}

/** Whether the page belongs to a section that shows the metadata header. */
export function hasMetadataHeader(id: string): boolean {
	return requiredFieldsFor(id).length > 0;
}

/** Required fields absent (undefined or null) from the raw frontmatter. */
export function missingRequiredFields(id: string, data: Record<string, unknown>): GuideField[] {
	return requiredFieldsFor(id).filter((field) => data[field] === undefined || data[field] === null);
}

/** Throws an error naming the page and its missing required fields. */
export function assertRequiredFields(id: string, data: Record<string, unknown>): void {
	const missing = missingRequiredFields(id, data);
	if (missing.length > 0) {
		throw new Error(
			`[contenido] La página "${id}" no declara los campos obligatorios: ${missing.join(', ')}`,
		);
	}
}

/**
 * Same validation the build applies to one page: section-required fields plus value formats.
 * Returns human-readable issues; an empty array means the frontmatter is valid.
 */
export function validateGuideFrontmatter(id: string, data: Record<string, unknown>): string[] {
	const issues: string[] = [];
	try {
		assertRequiredFields(id, data);
	} catch (error) {
		issues.push((error as Error).message);
	}
	const description = data.description;
	if (requiredFieldsFor(id).includes('description') && typeof description === 'string') {
		const length = [...description].length;
		if (length < DESCRIPTION_MIN || length > DESCRIPTION_MAX) {
			issues.push(
				`[contenido] La página "${id}" tiene un valor inválido en description: debe tener entre ${DESCRIPTION_MIN} y ${DESCRIPTION_MAX} caracteres (tiene ${length})`,
			);
		}
	}
	const parsed = guideMetadataSchema.safeParse(data);
	if (!parsed.success) {
		for (const issue of parsed.error.issues) {
			issues.push(
				`[contenido] La página "${id}" tiene un valor inválido en ${issue.path.join('.')}: ${issue.message}`,
			);
		}
	}
	return issues;
}
