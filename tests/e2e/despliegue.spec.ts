import { expect, test } from '@playwright/test';

// Headers from vercel.json are only observable on a real Vercel deployment,
// so these tests run against PREVIEW_URL and are skipped when it is not set.
const PREVIEW_URL = process.env.PREVIEW_URL?.replace(/\/+$/, '');
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const extraHTTPHeaders: Record<string, string> = BYPASS
	? { 'x-vercel-protection-bypass': BYPASS, 'x-vercel-set-bypass-cookie': 'true' }
	: {};

const SECURITY_HEADERS = [
	'content-security-policy',
	'strict-transport-security',
	'referrer-policy',
	'x-content-type-options',
	'x-frame-options',
];

test.describe('despliegue', () => {
	test.skip(!PREVIEW_URL, 'PREVIEW_URL is not set');
	test.use({ extraHTTPHeaders });

	const expectSecurityHeaders = (headers: Record<string, string>) => {
		for (const name of SECURITY_HEADERS) expect(headers[name], name).toBeTruthy();
		expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
		expect(headers['x-content-type-options']).toBe('nosniff');
		expect(headers['x-frame-options']).toBe('DENY');
	};

	test('Scenario: Cabeceras de seguridad en una página', async ({ request }) => {
		const response = await request.get(`${PREVIEW_URL}/`);
		expect(response.status()).toBe(200);
		expectSecurityHeaders(response.headers());
	});

	test('Scenario: Cabeceras de seguridad en una ruta inexistente', async ({ request }) => {
		const response = await request.get(`${PREVIEW_URL}/ruta-que-no-existe-w12/`);
		expect(response.status()).toBe(404);
		expectSecurityHeaders(response.headers());
	});

	test('Scenario: Cabeceras de seguridad en un recurso estático', async ({ request }) => {
		const html = await (await request.get(`${PREVIEW_URL}/`)).text();
		const asset = html.match(/\/_astro\/[^"'\s)]+/)?.[0];
		expect(asset, 'home page must reference an /_astro/ asset').toBeTruthy();
		const response = await request.get(`${PREVIEW_URL}${asset}`);
		expectSecurityHeaders(response.headers());
		expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
	});

	test('Scenario: HTML no inmutable', async ({ request }) => {
		const response = await request.get(`${PREVIEW_URL}/`);
		expect(response.headers()['cache-control'] ?? '').not.toContain('immutable');
	});

	test('Scenario: La búsqueda funciona con la CSP activa', async ({ page }) => {
		const violations: string[] = [];
		page.on('console', (msg) => {
			if (/content security policy/i.test(msg.text())) violations.push(msg.text());
		});
		await page.goto(`${PREVIEW_URL}/`);
		await page.locator('site-search button[data-open-modal]').first().click();
		await page.locator('site-search .pagefind-ui__search-input').fill('OpenSpec');
		await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
		expect(violations).toEqual([]);
	});
});
