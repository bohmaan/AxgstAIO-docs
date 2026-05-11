# Telemetry & webhooks

How HopAIO reports its lifecycle and checkouts. Rewritten in v2.1.18 — one server endpoint replaces the old fan-out of Discord webhooks from the bot.

## High-level

```
bot ──POST /v1/events──▶ license server ┬─▶ public Discord webhook    (checkout_success)
                                        ├─▶ user's configured webhook (checkout_success)
                                        ├─▶ ops Discord webhook       (cli_*, batch_*, ops, cli_offline)
                                        └─▶ admin dashboard (every event, persisted to SQLite)
```

Failures are **never** webhook'd anywhere. They surface in your local console and the admin Events Feed only.

## Event types

| Event | When | Discord destination | Visible in admin dashboard |
|---|---|---|---|
| `cli_started` | Bot launches, after license check | Ops webhook (🟢 green) | Live Sessions + Events Feed |
| `heartbeat` | Every 10 s while running | — | Refreshes session last-seen |
| `batch_started` | One per CSV / QT batch | Ops webhook (🔵 blue) | Events Feed |
| `batch_finished` | One per batch when done | Ops webhook (🟢 green) | Events Feed |
| `checkout_success` | Each successful order | Public + user webhook | User Dashboard checkouts + Events Feed |
| `cli_stopped` | atexit best-effort | Ops webhook (⚫ gray) | Session → status="stopped" |
| `cli_offline` | Server-synthetic when last_seen exceeds `HOP_SESSION_OFFLINE_AFTER_S` | Ops webhook (🔴 red) | Session → status="offline" |
| `ops` | Operator alerts (license, crash, sync) | Ops webhook | Events Feed |

## Embed payloads

### `cli_started` (since v2.1.20)

```
CLI started                                                            🟢
bohmaan • <machine_id> • v2.1.20 • tier: lifetime • ⚡ QT

System         Windows 10 • Py 3.14.0
Server         https://bohmannm.com
CSV files (3)  `media.csv`, `game.csv`, `sv.csv`
Proxies        120 (`proxylist.txt`)
Webhooks       user ✓, raffle ✓
```

A `🔭 monitor mode` flag appears in the description when `monitor_mode: true` is set in `config.json`.

### `batch_started` (since v2.1.20)

```
Batch started (150 tasks)                                              🔵
bohmaan • 150 task(s) • trigger: csv • source: media.csv

Sites          mediaexpert:120, alza:30
Modes          Normal:80, Auto:50, COD:15, InStore:5
Proxies        120 (proxylist.txt)
```

### `batch_finished` (since v2.1.20)

```
Batch finished (150 tasks)                                             🟢
bohmaan • 150 task(s) • 480s • trigger: csv • source: media.csv

Sites          mediaexpert:120, alza:30
Modes          Normal:80, Auto:50, COD:15, InStore:5
```

### `cli_offline` (since v2.1.20)

Server-synthetic — fires from the session reaper when a bot misses heartbeats for `HOP_SESSION_OFFLINE_AFTER_S` seconds (default 25). The reaper sweeps every 5 s, so the worst-case detection lag is **~30 s** with the default 10 s heartbeat.

```
CLI offline                                                            🔴
bohmaan • <machine_id> • v2.1.20 • missed for 28s
```

### `checkout_success`

Two embeds fan out from one event — same data, different audience:

- **Public webhook** (`HOP_PUBLIC_WEBHOOK_URL`): anonymised — no account email, no order ID, no payment URL. Just site / product / size / method / price / mode.
- **User's own webhook** (from `config.json` → `webhook_url`): full payload including order ID, payment URL, account email.

## Configuration

### CLI side (`config.json`)

```json
{
  "license_key": "…",
  "webhook_url": "https://discord.com/api/webhooks/…",
  "raffle_webhook_url": "https://discord.com/api/webhooks/…",
  "monitor_mode": false,
  "license_server_url": "https://bohmannm.com"
}
```

`webhook_url` is the only webhook the CLI ever sends to directly — and only for `checkout_success`. Everything else goes through `/v1/events`.

### Server side (env vars)

| Var | Purpose | Default |
|---|---|---|
| `HOP_PUBLIC_WEBHOOK_URL` | Public success channel | unset → no public dispatch |
| `HOP_OPS_SPAM_WEBHOOK` | Operator lifecycle / ops alerts | unset → no ops dispatch |
| `HOP_SESSION_OFFLINE_AFTER_S` | Seconds before reaper marks online sessions offline | `25` |
| `HOP_EVENTS_PER_SESSION_CAP` | Max events retained per session | `2000` |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Admin panel OAuth login | unset → 503 on login |
| `ADMIN_EMAIL` | Whose Discord email may sign in to admin | `bohmanneu@gmail.com` |

## Reliability

The CLI's event emitter is **fire-and-forget**. A background worker drains the in-memory queue and POSTs to `/v1/events` with the license token; when the endpoint is unreachable, events are appended to a file-backed buffer at `dashboard/data/events_buffer.jsonl` (5000-line cap, oldest dropped). The buffer drains on the next successful POST.

If you see a non-empty buffer file on the CLI machine for more than a few minutes, the bot can't reach the license server (firewall, DNS, expired license). Network issues never block checkouts — telemetry is best-effort.

## Admin dashboard tabs

Available after Discord OAuth login at `bohmannm.com/HopAIO Admin.html`:

- **Live Sessions** — every running bot with status pill, last-heartbeat timestamp, active-tasks counter, version, machine ID. Auto-refreshes every 8 s.
- **Events Feed** — chronological feed of every event (last 300). Filter chips per event type, free-text search.
- **Download Bot** — streams the latest release EXE through the server. Works for both license-key dashboard sessions and Discord OAuth admin sessions.

See also: [Changelog v2.1.18](/changelog#v2-1-18-events-pipeline-rewrite-mediaexpert-cod-in-store-pickup) for the rationale behind the rewrite.
