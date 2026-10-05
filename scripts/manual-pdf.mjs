// Generates public/manual-openspec.pdf from the built /manual/ page, plus its text fingerprint
// (public/manual-openspec.sha256) and size (src/data/manual.json). Run: npm run manual:pdf (w14).
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { MANUAL_HASH, MANUAL_HTML, manualHash } from './manual-hash.mjs';

const PORT = 4339;
const PDF = 'public/manual-openspec.pdf';
const SIZE_JSON = 'src/data/manual.json';
const shell = process.platform === 'win32';

function build() {
	const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell });
	if (result.status !== 0) throw new Error('npm run build falló');
}

async function waitFor(url, timeoutMs = 60_000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {
			// server not up yet
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`astro preview no respondió en ${url}`);
}

function stop(child) {
	if (shell) spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
	else child.kill('SIGTERM');
}

async function printPdf() {
	const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore', shell });
	try {
		const url = `http://localhost:${PORT}/manual/`;
		await waitFor(url);
		const browser = await chromium.launch();
		try {
			const page = await browser.newPage();
			await page.goto(url, { waitUntil: 'networkidle' });
			// Label every tab panel with its tab name so the printed PowerShell/bash variants stay identifiable.
			await page.evaluate(() => {
				for (const panel of document.querySelectorAll('starlight-tabs [role="tabpanel"]')) {
					const label = document.getElementById(panel.getAttribute('aria-labelledby') ?? '')?.textContent?.trim();
					if (label) panel.setAttribute('data-manual-tab', label);
				}
			});
			await page.evaluate(() => document.fonts.ready);
			await page.emulateMedia({ media: 'print' });
			// Page size and margins come from @page in /manual/ (no margin on the cover, so no footer there).
			await page.pdf({
				path: PDF,
				preferCSSPageSize: true,
				printBackground: true,
				displayHeaderFooter: true,
				headerTemplate: '<span></span>',
				footerTemplate:
					'<div style="width:100%;margin:0 16mm;display:flex;justify-content:space-between;font-family:Helvetica,Arial,sans-serif;font-size:7px;color:#52606d"><span>OpenSpec desde cero · Manual práctico</span><span class="pageNumber"></span></div>',
			});
		} finally {
			await browser.close();
		}
	} finally {
		stop(preview);
	}
}

build();
await printPdf();
writeFileSync(MANUAL_HASH, `${manualHash(readFileSync(MANUAL_HTML, 'utf8'))}\n`);
const { size } = statSync(PDF);
writeFileSync(SIZE_JSON, `${JSON.stringify({ bytes: size }, null, '\t')}\n`);
console.log(`${PDF}: ${size} bytes. Huella en ${MANUAL_HASH}.`);
