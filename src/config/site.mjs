// @ts-check

export const FALLBACK_SITE_URL = 'http://localhost:4321';

/**
 * Resolves the absolute site origin used for canonical URLs and the sitemap.
 * @param {Record<string, string | undefined>} env
 * @returns {string}
 */
export function resolveSiteUrl(env) {
	return env.SITE_URL || FALLBACK_SITE_URL;
}
