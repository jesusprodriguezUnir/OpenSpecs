import type { Page } from '@playwright/test';

export const CHAT_REFERENCE = '/referencia/comandos-chat/';

export type ChatReference = { commands: string[]; workflows: string[] };

/** Names of every `/opsx:<name>` string in `text`, in order of appearance and without repeats. */
export function opsxNames(text: string): string[] {
	return [...new Set([...text.matchAll(/\/opsx:([a-z][a-z-]*)/g)].map((m) => m[1]))];
}

/** Names of the `/opsx:<name>` commands in `text` that the chat reference documents neither as a command nor as a workflow. */
export function undocumentedCommands(text: string, reference: ChatReference): string[] {
	const known = new Set([...reference.commands, ...reference.workflows]);
	return opsxNames(text).filter((n) => !known.has(n));
}

/** Commands and extended-profile workflows documented in /referencia/comandos-chat/. Navigates `page` there. */
export async function chatReference(page: Page): Promise<ChatReference> {
	await page.goto(CHAT_REFERENCE);
	return page.locator('main').evaluate((main) => {
		const commands = [...(main.textContent ?? '').matchAll(/\/opsx:([a-z][a-z-]*)/g)].map((m) => m[1]);
		const table = [...main.querySelectorAll('table')].find((t) => t.querySelector('th')?.textContent?.trim() === 'Workflow');
		const workflows = [...(table?.querySelectorAll('tbody td:first-child code') ?? [])].map((c) => c.textContent?.trim() ?? '');
		return { commands, workflows };
	});
}
