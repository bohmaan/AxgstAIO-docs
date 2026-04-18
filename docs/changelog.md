# Changelog

Version history and release notes. For the full commit log, see [GitHub releases](https://github.com/bohmaan/AxgstAIO/releases).

## v1.4.2 — Games Island

- New module: **games-island.eu** ([Games Island](/sites/gamesisland)) — JTL-Shop 5 store for TCG / tabletop / board games.
- Pure-Python solver for **in-Reach CBF** (CapJS WebAssembly PoW) — ~0.15–0.3 s, no browser.
- Register + auto-saved address + reCAPTCHA v2 via CapSolver.
- Buy flow with monitor, empik-style price check, 404 retry, ATC retry on OOS / insufficient quantity.
- Checkout with **Vorkasse / bank transfer** as a single consolidated POST (shipping + payment + final submit in one request).

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
