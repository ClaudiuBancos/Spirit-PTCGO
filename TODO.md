# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Get it running locally (single PC)
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
- [x] Prep the client: `cake.cfg` backed up to `cake.cfg.orig` and pointed at 127.0.0.1 (LF endings kept)
- [x] Set up and start the server: venv, deps, `server.crt`/`server.key`, `ptcgo_server.db` (seeded `brandon` / `password`)
	- [x] First boot took ~6 min (AutoBundle + ~620 MB `generatedBundleCache`); later boots reuse the cache
	- [x] Verified: HTTP 8000 and `/admin` return 200, TCP 39389 completes a TLS handshake
	- [x] Start it with `.\run.bat` (with the `.\`): a bare `run.bat` failed from the shells used here
