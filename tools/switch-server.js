#!/usr/bin/env node
// Points the PTCGO client at a server by rewriting the hostname / versionURL / assetURL
// lines of its cake.cfg. Everything else in the file (app secrets, version, LF endings)
// is left as-is.
//
//   node tools/switch-server.js            show which server the client points at
//   node tools/switch-server.js local      this PC's Spirit server (127.0.0.1)
//   node tools/switch-server.js glc        the GLC community server
//   node tools/switch-server.js official   the original Direwolf servers (shut down)
//   node tools/switch-server.js toggle     local <-> glc
//
// Client folder: PTCGO_CLIENT_DIR, else "../Pokemon TCG Online Client/PokemonTradingCardGameOnline"
// next to this repo. You can also pass it as a second argument.

const fs = require('fs');
const path = require('path');

const PROFILES = {
	local: {
		hostname: '127.0.0.1',
		versionURL: 'http://127.0.0.1:8000/',
		assetURL: 'http://127.0.0.1:8000/',
	},
	glc: {
		hostname: '167.233.237.46',
		versionURL: 'http://167.233.237.46:8000/',
		assetURL: 'http://167.233.237.46:8000/',
	},
	official: {
		hostname: 'tcgo-gateway.direwolfdigital.com',
		versionURL: 'https://pie-live-dist.s3.amazonaws.com/',
		assetURL: 'https://dfsqwbwcu8r1a.cloudfront.net/',
	},
};
const KEYS = ['hostname', 'versionURL', 'assetURL'];

function clientDir(arg) {
	if (arg) return arg;
	if (process.env.PTCGO_CLIENT_DIR) return process.env.PTCGO_CLIENT_DIR;
	return path.resolve(__dirname, '..', '..', 'Pokemon TCG Online Client', 'PokemonTradingCardGameOnline');
}

function readSettings(text) {
	const settings = {};
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^(\w+)=(.*)$/);
		if (m && KEYS.includes(m[1])) settings[m[1]] = m[2];
	}
	return settings;
}

function profileName(settings) {
	for (const [name, profile] of Object.entries(PROFILES)) {
		if (KEYS.every((k) => settings[k] === profile[k])) return name;
	}
	return null;
}

function describe(settings) {
	const name = profileName(settings);
	const lines = KEYS.map((k) => `  ${k}=${settings[k] ?? '(missing)'}`);
	return `${name ? `Client points at: ${name}` : 'Client points at a custom server'}\n${lines.join('\n')}`;
}

function main() {
	const [target, dirArg] = process.argv.slice(2);
	const cfgPath = path.join(clientDir(dirArg), 'Pokemon Trading Card Game Online_Data', 'cake.cfg');
	if (!fs.existsSync(cfgPath)) {
		console.error(`cake.cfg not found at ${cfgPath}\nSet PTCGO_CLIENT_DIR to the folder that holds "Pokemon Trading Card Game Online.exe".`);
		process.exit(1);
	}
	const text = fs.readFileSync(cfgPath, 'utf8');

	if (!target || target === 'status') {
		console.log(describe(readSettings(text)));
		return;
	}
	const name = target === 'toggle' ? (profileName(readSettings(text)) === 'local' ? 'glc' : 'local') : target;
	const profile = PROFILES[name];
	if (!profile) {
		console.error(`Unknown server "${target}". Choose one of: ${Object.keys(PROFILES).join(', ')}, toggle, status`);
		process.exit(1);
	}

	const seen = new Set();
	const updated = text.replace(/^(\w+)=[^\r\n]*/gm, (line, key) => {
		if (!KEYS.includes(key)) return line;
		seen.add(key);
		return `${key}=${profile[key]}`;
	});
	const missing = KEYS.filter((k) => !seen.has(k));
	if (missing.length) {
		console.error(`cake.cfg has no ${missing.join(', ')} line; not changing it.`);
		process.exit(1);
	}

	const backup = cfgPath + '.orig';
	if (!fs.existsSync(backup)) fs.copyFileSync(cfgPath, backup);
	fs.writeFileSync(cfgPath, updated, 'utf8');
	console.log(describe(readSettings(fs.readFileSync(cfgPath, 'utf8'))));
	console.log('Restart the game if it is open.');
}

main();
