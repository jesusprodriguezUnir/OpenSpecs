import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const BLOCKING_IMPACTS = ['serious', 'critical'];

/** Fails when axe finds violations of impact serious or critical on the current page. */
export async function expectNoSevereViolations(page: Page) {
	const { violations } = await new AxeBuilder({ page }).analyze();
	const severe = violations
		.filter((v) => BLOCKING_IMPACTS.includes(v.impact ?? ''))
		.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
	expect(severe, 'axe found serious/critical violations').toEqual([]);
}
