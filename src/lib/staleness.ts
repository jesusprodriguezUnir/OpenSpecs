const MS_PER_DAY = 86_400_000;

function utcDay(date: Date): number {
	return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** Whole calendar days (UTC) from `from` to `to`. */
export function daysBetweenUtc(from: Date, to: Date): number {
	return Math.round((utcDay(to) - utcDay(from)) / MS_PER_DAY);
}

/** True when `lastReviewed` is more than `thresholdDays` calendar days (UTC) before `now`. */
export function isStale(lastReviewed: Date, now: Date, thresholdDays = 180): boolean {
	return daysBetweenUtc(lastReviewed, now) > thresholdDays;
}

/** Build date: `BUILD_DATE` (ISO date) when set, otherwise the current date. */
export function getBuildDate(env: Record<string, string | undefined> = process.env): Date {
	const raw = env.BUILD_DATE?.trim();
	if (!raw) return new Date();
	const date = new Date(raw);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`[contenido] BUILD_DATE no es una fecha válida: "${raw}"`);
	}
	return date;
}
