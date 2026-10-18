# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Get it running locally (single PC)
- [ ] Prep the client (`D:\1. Programming\Pokemon TCG Online Client\PokemonTradingCardGameOnline`)
	- [ ] Back up `Pokemon Trading Card Game Online_Data\cake.cfg` (e.g. `cake.cfg.orig`)
	- [ ] Set `hostname=127.0.0.1`, `versionURL=http://127.0.0.1:8000/`, `assetURL=http://127.0.0.1:8000/`
		- [ ] Leave the AppSecret lines and the trailing `version=2.95.0.5815` untouched
- [ ] Set up and start the server
	- [ ] Run `run.bat` from the repo root (Python 3.12.6 is already installed and on PATH)
		- [ ] Creates `venv`, installs requirements, generates `server.crt`/`server.key`, seeds `ptcgo_server.db`
		- [ ] Do NOT install `server.crt` into the Windows trust store (the README says this breaks the client)
	- [ ] Let the first boot finish: AutoBundle builds bundles from ~1.8 GB of card PNGs, which can take a while
	- [ ] Allow/deny the Windows Firewall prompt (local-only play does not need inbound access)
- [ ] Play
	- [ ] Launch `Pokemon Trading Card Game Online.exe` directly, not `Refresher\Refresher.exe` (an old 2.70 patcher)
	- [ ] Log in: any new username/password auto-registers, or use the seeded `brandon` / `password`
	- [ ] Open `http://127.0.0.1:8000/admin` → Accounts → Grant All Cards on your account
	- [ ] Smoke test: collection loads, open a pack, build a deck, play a solo match vs the AI bot
- [ ] Make it convenient
	- [ ] Small launcher that starts the server, waits for port 39389, then starts the client
	- [ ] Script to swap `cake.cfg` between the original and local settings

## Known limits worth knowing
- [ ] The AI opponent is minimal (picks the first valid target); real games need a second human
	- [ ] A second human can join over LAN by setting `SPIRIT_PUBLIC_HOST` to this PC's LAN IP and pointing their `cake.cfg` at it
- [ ] Card pool is mainly Sword & Shield era (SWSH1–12, CEL25, PGO, Crown Zenith) plus a few BW cards and Free_Energy
- [ ] Optional: original game cache (UI art, logos) can go in `spirit/assets/externalCache/` or `PTCGO_CACHE_DIR`; none was found on this PC
- [ ] README links to `spirit/game/README.md` and `spirit/game/decks/THEME_DECKS.md`, which are not in the repo

## Maybe Someday
- [ ] Change the seeded admin password if the server is ever exposed beyond this PC
- [ ] Remote play for friends (port-forward 8000 + 39389, or follow `deploy/README.md` for a VPS)
- [ ] Add custom cards, sleeves, coins, or deck boxes (see README)

## Done
- [x] Repo overview written to ARCHITECTURE.md
