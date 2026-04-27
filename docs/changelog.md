# Changelog

Version history and release notes. For the full commit log, see [GitHub releases](https://github.com/bohmaan/AxgstAIO/releases).

## v1.4.8 — generic Queue-it pass-through module

- New module: **queueit** (alias `qit`) — site-agnostic [Queue-it](/sites/queueit) solver. Paste any `*.queue-it.net` queue page URL into the CSV and the bot waits in the queue, then sends the resulting **pass link** to the webhook. Open it in a real browser within ~1-5 min and you're past the queue.
- Works for any Queue-it customer (Supreme, Adidas, Ticketmaster, public-sector portals, IPZS, …) — no per-site module needed.
- Use this when the destination site has no AxgstAIO module of its own, or when you want manual checkout. For full end-to-end automation through a queued site, prefer the per-site module (e.g. [IPZS](/sites/ipzs)).

## v1.4.7 — shop.ipzs.it (IPZS) module

- New module: **shop.ipzs.it** ([IPZS](/sites/ipzs)) — Italian State Mint, numismatic & commemorative coin shop. Buy mode only — register the account manually on the site, then plug the credentials into the CSV.
- Handles Queue-it gating on hyped drops automatically (no browser).
- OOS retry loop — when Magento reports stock gone, the bot keeps retrying ATC at the CSV `delay` interval, refetching the product page each time so live restocks during a drop are picked up automatically.
- PayPal Express checkout — approval URL is sent to the webhook for the user to authorise.

## v1.4.6 — catchyourcards.nl module

- New module: **catchyourcards.nl** ([CatchYourCards](/sites/catchyourcards)) — Pokémon TCG / One Piece / Lorcana store. ~3-4 s end-to-end.
- `test` mode — runs all 8 ATC variants and writes a debug log; useful during a real Queue-Fair drop to validate which paths still pass.
- Auth-required proxies supported (no Chrome auth-dialog popup).
- Checkout returns a Mollie iDEAL URL on the webhook.

## v1.4.5 — Elbenwald checkout fix

- ATC line items no longer silently dropped — checkout now reliably creates the order.
- Captcha-related session loss fixed; cart no longer appears empty after captcha solve.
- Switched to PayPal Express checkout — one-shot order placement, returns the PayPal URL on the webhook.
- Cart cleared on each run start — no more stacked qty from previous attempts.

## v1.4.4 — Empik monitor rewrite

- Price monitor now uses a single small GraphQL request per tick instead of fetching the full HTML page.
- ~450× less proxy bandwidth on long monitor runs.
- Auto-rotates proxies on rate-limit / ban responses instead of hammering a dead IP.

## v1.4.3 — Games Island + bandwidth savings

- New module: **games-island.eu** ([Games Island](/sites/gamesisland)) — JTL-Shop 5 store for TCG / tabletop / board games. Register + auto-saved address + reCAPTCHA v2. Checkout via Vorkasse / bank transfer.
- Empik price monitor switched to REST + GQL only (no HTML fallback) — per-hour proxy usage on long monitor runs capped at ~2–4 MB instead of ~480 MB.
- Empik buy: stops re-fetching the product page on ATC/checkout failures (was costing tens of MB per failure); falls back to price monitoring.
- BasketballEmotion + FutbolEmotion: drop-wait loop uses HEAD requests, ~800× less bandwidth while waiting.

## v1.2.1 — Clean log output

- Removed debug prints, entry banners, and PayPal URL from the console (still posted to webhooks).
- Unified print style across all modules: `Restored session` / `Found: <name>` / `Size: <x>` / `Successful checkout (Ns)`.
- No functional changes.

## v1.2.0 — Checkout reliability

- Refetch checkout version immediately before `place-order` to eliminate `order-token-expired` errors.
- Keeps the v1.1.9 parallelizations (product + login, GQL state + payment HTML).

## v1.1.9 — Parallelization

- `get_product` + `login` run in parallel threads.
- `GQL CHECKOUT_STATE` + payment HTML page fetched in parallel.
- ~6 s faster end-to-end on Zalando checkouts.

## v1.1.8 — Experimental (reverted in v1.2.0)

- Attempted to skip the 2nd `GQL CHECKOUT_STATE` call for `version`. Triggered `order-token-expired` because version changes after PayPal select. Rolled back.

## v1.1.7 — Checkout address detection

- Broader address-present check in Zalando checkout state. Looks at 9 different delivery fields + recursive `street/city/zip` search.
- Removed in v1.2.1 once the flow stabilized.

## v1.1.6 — Abort on login failure

- Checkout tasks now abort immediately on login failure instead of continuing to probe + ATC.

## v1.1.5 — Web login body shape

- Added `response_type`, `scope`, `nonce`, `state` to `authentication_request` body. Zalando server was rejecting the body without them.

## v1.1.4 — Akamai halt handling

- Explicit detection for `{"edge_error":"halt"}` responses — no more uncaught exceptions.
- Wrapped `.json()` in try/except across login and register flows.

## v1.1.3 — Login reverted to web flow

- Mobile OAuth flow (`fashion-store-mobile-android`) consistently failed with `401 Xsrf validation failed` on `authentications/credentials`. Web flow (`fashion-store-web`) works and is stable.
- Register still uses mobile flow.

## v1.1.2 — Update mechanism fix (WinError 183)

- Switched `Path.rename()` → `os.replace()` for Windows-safe overwrites.
- Stale `.old` / `.tmp` are cleaned at the start of every update.

## v1.1.0–1.1.1 — Zalando mobile SSO

- First attempt at mobile-Android flow for Zalando. Correct redirect URI `de.zalando.mobile://zalando/auth` discovered via APK decompilation.
- Register body switched to SPA-compatible shape (`client_id + request_id + redirect_uri + ui_locales + tc`).
- Login still failed with XSRF — see v1.1.3.

## v1.0.9 and earlier

Initial releases. Basic support for Zalando, SportsShoes, Empik, BasketballEmotion, FutbolEmotion. No auto-update.
