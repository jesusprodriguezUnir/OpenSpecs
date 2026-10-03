import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { assertRequiredFields, guideMetadataSchema } from './lib/content-rules';

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
};
