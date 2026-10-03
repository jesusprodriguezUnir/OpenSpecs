import { defineConfig, devices } from '@playwright/test';

export const E2E_SITE_URL = 'https://example.org';
// Dedicated port so a local dev server on 4321 is never reused by mistake.
const PORT = 4329;
// Fixed build date 181 days after the placeholders lastReviewed (2026-10-03) so the stale warning renders deterministically.
export const E2E_BUILD_DATE = "2027-04-02";

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? 'github' : 'list',
	use: { baseURL: `http://localhost:${PORT}` },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		env: { SITE_URL: E2E_SITE_URL, BUILD_DATE: E2E_BUILD_DATE },
		url: `http://localhost:${PORT}`,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
