import { REPO_BRANCH, REPO_URL } from './site';

export type ArchiveFolder = { date: string; name: string };

export type ChangeEntry = { folder: string; date: string; name: string; summary?: string };
export type SpecDomainEntry = { domain: string; requirements: number };

const ARCHIVE_FOLDER = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

/** Splits `YYYY-MM-DD-<name>` into date and name; null when the folder has no date prefix. */
export function parseArchiveFolder(folder: string): ArchiveFolder | null {
	const match = ARCHIVE_FOLDER.exec(folder);
	return match ? { date: match[1], name: match[2] } : null;
}

/** First paragraph of the `## Why` section as plain text, or undefined when absent or empty. */
export function extractWhySummary(markdown: string): string | undefined {
	const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
	const start = lines.findIndex((line) => /^##\s+Why\s*$/.test(line));
	if (start === -1) return undefined;

	const paragraph: string[] = [];
	for (const line of lines.slice(start + 1)) {
		if (/^#{1,6}\s/.test(line)) break;
		if (line.trim() === '') {
			if (paragraph.length > 0) break;
			continue;
		}
		paragraph.push(line.trim());
	}
	return paragraph.length > 0 ? paragraph.join(' ') : undefined;
}

/** Number of `### Requirement:` headings in a spec. */
export function countRequirements(markdown: string): number {
	return (markdown.match(/^###\s+Requirement:/gm) ?? []).length;
}

/** Newest first by date; ties keep a stable order by name. */
export function sortChangesDesc<T extends { date: string; name: string }>(changes: readonly T[]): T[] {
	return [...changes].sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
}

export const changeFolderUrl = (folder: string): string =>
	`${REPO_URL}/tree/${REPO_BRANCH}/openspec/changes/archive/${folder}`;

export const specFileUrl = (domain: string): string =>
	`${REPO_URL}/blob/${REPO_BRANCH}/openspec/specs/${domain}/spec.md`;

/** Folder name (the directory that holds the file) from a collection entry's `filePath`. */
export function parentFolder(filePath: string): string {
	const parts = filePath.replace(/\\/g, '/').split('/');
	return parts[parts.length - 2] ?? '';
}

type RawEntry = { filePath?: string; body?: string };

export type HistoryView = {
	changes: ChangeEntry[];
	domains: SpecDomainEntry[];
	showChangesEmpty: boolean;
	showDomainsEmpty: boolean;
};

/** Builds what the page renders; empty lists turn into empty states instead of blank sections. */
export function buildHistoryView(changelog: readonly RawEntry[], specs: readonly RawEntry[]): HistoryView {
	const changes = sortChangesDesc(
		changelog.flatMap((entry) => {
			const folder = parentFolder(entry.filePath ?? '');
			const parsed = parseArchiveFolder(folder);
			if (!parsed) return [];
			return [{ folder, ...parsed, summary: extractWhySummary(entry.body ?? '') }];
		}),
	);
	const domains = specs
		.map((entry) => ({
			domain: parentFolder(entry.filePath ?? ''),
			requirements: countRequirements(entry.body ?? ''),
		}))
		.filter((entry) => entry.domain !== '')
		.sort((a, b) => a.domain.localeCompare(b.domain));

	return {
		changes,
		domains,
		showChangesEmpty: changes.length === 0,
		showDomainsEmpty: domains.length === 0,
	};
}
