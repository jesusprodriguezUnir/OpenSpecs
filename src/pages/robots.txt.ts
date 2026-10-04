import type { APIRoute } from 'astro';
import { FALLBACK_SITE_URL } from '../config/site.mjs';
import { robotsTxt } from '../lib/seo';

export const GET: APIRoute = ({ site }) =>
	new Response(robotsTxt(site ?? FALLBACK_SITE_URL), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
