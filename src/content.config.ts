import { defineCollection } from 'astro:content';
import { file, glob, type Loader } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { assertRequiredFields, guideMetadataSchema } from './lib/content-rules';
import { resourceSchema } from './lib/resources-schema';

/**
 * Wraps Starlight's docs loader so section-required metadata is checked with the entry id
 * (a schema superRefine does not receive it). A missing field throws and fails the build.
 */
function docsLoaderWithRequiredMetadata(): Loader {
	const inner = docsLoader();
	return {
		...inner,
		load: (context) =>
			inner.load({
				...context,
				parseData: async (props) => {
					assertRequiredFields(props.id, props.data as Record<string, unknown>);
					return context.parseData(props);
				},
			}),
	};
}

export const collections = {
	docs: defineCollection({
		loader: docsLoaderWithRequiredMetadata(),
		schema: docsSchema({ extend: guideMetadataSchema }),
	}),
	// External links listed on /recursos/. Each entry declares an explicit id so build errors name it.
	resources: defineCollection({
		loader: file('src/data/resources.yaml'),
		schema: resourceSchema,
	}),
	// Archived OpenSpec proposals and current specs, rendered on /como-se-hizo/. Files have no
	// frontmatter, so data stays empty; the folder name comes from `filePath` (glob ids are slugified).
	changelog: defineCollection({
		loader: glob({ base: './openspec/changes/archive', pattern: '*/proposal.md' }),
	}),
	specDomains: defineCollection({
		loader: glob({ base: './openspec/specs', pattern: '*/spec.md' }),
	}),
};
