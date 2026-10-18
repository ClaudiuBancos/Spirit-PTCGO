# Architecture

SpiritPTCGO is a Python (asyncio) server emulator for the shut-down Pokémon TCG Online
client, targeting client **2.95.0.5815** (Unity 2018.4). The client keeps its own UI and
art; the server supplies everything else: login, collection/economy, matchmaking, and the
full rules engine (the client does no rules logic — it only renders what the server sends).

## Runtime shape

`python -m spirit.main` (or `run.bat`) starts two servers in one process:

| Server | Port | Purpose |
| --- | --- | --- |
| TLS TCP "Warg" game server | 39389 | Login handshake, all game/lobby/match packets (protobuf over TLS) |
| HTTP asset server | 8000 | Version/patcher JSON, CAS/SSO login pages, asset manifests, `.unity3d` bundles, MOTD/landing pages, `/admin` dashboard |

The client is pointed at these by editing `cake.cfg` in its `_Data` folder
(`hostname`, `versionURL`, `assetURL`). Ports and public host live in `spirit/config.py`
(env-overridable: `SPIRIT_PUBLIC_HOST`, `SPIRIT_HTTP_PORT`, `SPIRIT_TCP_PORT`, `SPIRIT_DATABASE_URL`, …).

Startup sequence (`spirit/main.py`): create/migrate DB tables → bootstrap admins → load
tournaments & quest catalog → **AutoBundle** (build card/cosmetic `.unity3d` bundles from
PNGs + scripts) → refresh asset manifest → start HTTP thread → run TCP server loop.

## Directory map

- `run.bat` / `run.sh` — one-shot launcher: venv, `pip install`, cert, DB seed, start.
- `requirements.txt` — protobuf, SQLAlchemy, PyMySQL, UnityPy, Pillow, cryptography, requests.
- `spirit/`
	- `main.py` — entrypoint (see above). `config.py` — host/ports/DB URL/tunables.
	- `network/` — wire layer. `protocol.py` frames/compresses packets, `message_names.py` maps
	  IDs to names, `generate_cert.py` makes the self-signed `server.crt`/`server.key`.
	- `server/`
		- `server.py`, `client_handler.py` — TLS accept loop and per-connection reader/writer.
		- `http_server.py` — asset/CAS/manifest HTTP server; also serves admin API.
		- `auto_bundle.py`, `auto_bundle_cosmetics.py`, `bundle_variants.py`, `foil_mask_gen.py` —
		  generate Unity AssetBundles for cards, sleeves, coins, deck boxes, packs, PCDs.
		- `manifest_manager.py`, `asset_map.json` — what bundles the client is told exist.
		- `dynamic_pages.py` — landing/MOTD pages. `admin/`, `admin_api.py`, `admin_auth.py` —
		  web Admin Dashboard at `/admin` (grant cards, manage accounts, etc.).
		- `state.py`, `metrics.py` — shared server state and loop-lag metrics.
	- `packets/` — `router.py` dispatches decoded messages to `handlers/` (auth, handshake,
	  data_sync, matchmaking, gameplay, shop, trade, social, quests, tournaments, redemption, system).
	- `protobuf/` — precompiled `*_pb2` classes for the client's DWD/Warg messages.
	- `game/`
		- `session/` — the match engine. `game_session.py` (core turn/state machine, ~5.6k lines),
		  `effects.py` (EffectContext API card scripts call), `legal_actions.py` (what the client
		  may highlight/do), `passives.py`, `vunion.py`, `legends.py`, `manager.py` (matchmaking
		  queues and solo matches), `network_player.py` / `ai_player.py` (human vs. very basic bot).
		- `scripts/cards/<SET>/` — ~3,000 per-card Python definitions (data + effect coroutines),
		  Sword & Shield era plus CEL25, PGO, Crown Zenith, a few BW, Free_Energy, CUSTOM.
		- `scripts/products/` — booster packs, theme decks, sleeves, coins, deck boxes per set.
		- `card_effects/` — shared effect helpers used by card scripts.
		- `content/` — card/product definition classes, set registry, reprints, starter decks.
		  `data_utils.py` re-exports the stable scripting API.
		- `decks/` — formats, theme decks, deck validation. `models/` — board, card, player, shop…
		- `progression/` — quests, daily rewards, versus seasons, account level.
		- `tournaments/` — tournament manager and live brackets.
	- `database/` — SQLAlchemy models (`models/`) and data-access modules; default SQLite file
	  `ptcgo_server.db` at repo root, optional MariaDB/MySQL. `setup_db.py` seeds the admin
	  account (`brandon` / `password`); `seed_collection.py` resyncs products to players.
		- `json_data/` — sets, formats, versus seasons, daily rewards/challenges, dynamic pages.
		- `game_data/` — localization DB.
	- `assets/`
		- `cards/<SET>/` — card PNGs (~1.8 GB, committed) that AutoBundle turns into bundles.
		- `products/` — custom cosmetic PNGs. `bundleCache/` — prebuilt/generated bundles.
		- `externalCache/` (git-ignored, optional) — original game cache to serve extra UI art.
	- `templates/card_bundle/` — Unity bundle templates used by AutoBundle.
	- `tools/` — `effect_coverage`, `effect_smoke`, `engine_selftest`, `rules_selftest`,
	  `import_set` (pull a set's images/data), foil-mask and cosmetic helpers.
- `tests/` — a handful of unit tests (action timer, notices, dynamic pages, decks…).
- `tools/diagnose_sets.py`, `re_tools/create_card_bundle.py` — reverse-engineering/diagnostic scripts.
- `sql/` — MariaDB/MySQL schema. `deploy/` — nginx config and VPS guide.
- `gallery/` — README screenshots.
