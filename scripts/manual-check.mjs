// CI gate: fails when public/manual-openspec.pdf no longer matches the built /manual/ (w14).
import { checkManual } from './manual-hash.mjs';

const { ok, message } = checkManual();
if (ok) console.log(message);
else {
	console.error(message);
	process.exit(1);
}
