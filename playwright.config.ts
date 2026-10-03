import { defineConfig, devices } from '@playwright/test';

export const E2E_SITE_URL = 'https://example.org';
// Dedicated port so a local dev server on 4321 is never reused by mistake.
const PORT = 4329;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? 'github' : 'list',
	use: { baseURL: `http://localhost:${PORT}` },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		env: { SITE_URL: E2E_SITE_URL },
		url: `http://localhost:${PORT}`,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
