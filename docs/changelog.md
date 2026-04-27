# Changelog

Version history and release notes. For the full commit log, see [GitHub releases](https://github.com/bohmaan/AxgstAIO/releases).

## v1.4.8 — generic Queue-it pass-through module

- New module: **queueit** (alias `qit`) — site-agnostic [Queue-it](/sites/queueit) solver. CSV column 2 is the queue page URL (`https://{customer}.queue-it.net/?c=…&e=…&t=…&cid=…`); the bot parses customer/event/target/culture from the query string, runs the same enqueue → poll → return-`redirectUrl` flow as the IPZS module, and emits the resulting `https://target/…?queueittoken=…` pass link to the webhook.
- Pure HTTP — no browser. Works for any Queue-it customer (Supreme drops, Adidas, Ticketmaster, public-sector portals, IPZS) since the SPA-API protocol is shared across all of them.
- Pass link is short-lived (1–5 min by config); user opens it in a real browser and Queue-it sets the HMAC-signed `QueueITAccepted-…` acceptance cookie on the destination domain.
- Use this module when the destination site has no AxgstAIO module of its own, or when you want manual checkout in your own browser. For full end-to-end automation through a queued site, prefer the per-site module (e.g. [IPZS](/sites/ipzs)).

## v1.4.7 — shop.ipzs.it (IPZS) module

- New module: **shop.ipzs.it** ([IPZS](/sites/ipzs)) — Italian State Mint (Istituto Poligrafico e Zecca dello Stato), numismatic & commemorative coin shop on Magento 2 + F5 BIG-IP ASM, Queue-it gated on hyped drops (collezione, anniversari, edizioni speciali). Buy mode only — register the account manually on the site (Italian-resident form requires `codice fiscale`, IT-only `country_id`, and a Magento image CAPTCHA), then plug the credentials into the CSV.
- **Request-based Queue-it passage** — no browser. Three-step protocol reverse-engineered live: `POST /spa-api/queue/{customer}/{event}/enqueue` → poll `…/{queue_id}/status` (~1 Hz, body has the queue-it `isClientRedayToRedirect` typo intact) → `GET redirectUrl?queueittoken=…` so Magento's queueit-intercept module Set-Cookies the official `QueueITAccepted-…` signed cookie. Per-task only — cookies live on the curl_cffi session and nowhere else, no file share, no cross-task reuse.
- **Form-based ATC** at `/checkout/cart/add/uenc/{b64}/product/{id}/`. Confirmation via `/customer/section/load/?sections=cart` + `mage-messages` cookie fallback. POSTs use `allow_redirects=False` so flash errors survive long enough to read — was the root cause of silent "ATC failed / Login failed" diagnostics in the WIP build.
- **OOS retry loop** — keeps retrying ATC while Magento reports stock gone (`Product that you are trying to add is not available.`, `non disponibile`, `stock for the requested`, …); refetches PDP each cycle for fresh `form_key` + stock state. Non-OOS errors break out immediately so we don't hammer pointlessly. `delay` (CSV column 6) controls retry interval, default 3 s.
- **Customer Bearer auth** for `/rest/V1/carts/mine/*` checkout (`estimate-shipping-methods` → `shipping-information` → `payment-information`). JWT obtained via `POST /rest/V1/integration/customer/token` after login. The session cookies handle ATC, the bearer handles checkout — Magento on IPZS scopes these endpoints to "customer" auth, not session cookies (returns `401 The consumer isn't authorized to access %resources` without it).
- **Login fix** — POSTs to `/customer/account/loginPost/` (the visible form) instead of the hidden checkout-mini form's `/login/` URL, which silently 200s without authenticating. The mini form is rendered hidden on the same page and was being matched first by `querySelector('#login-form')`.
- **Payment** — PayPal Express preferred (`/paypal/express/start/` AJAX returns the token; approval URL posted to webhook + console, same pattern as cyc/Mollie iDEAL & elbenwald/PayPal). Falls back to `braintree_paypal` / `braintree` / `checkmo` if PayPal Express isn't configured for the cart.

## v1.4.6 — catchyourcards.nl module

- New module: **catchyourcards.nl** — Pokémon TCG / One Piece / Lorcana store on WP + WooCommerce + Shoptimizer.
- Two modes:
  - `buy` — fast path: `POST /wp-json/wc/store/v1/cart/add-item` (Store API JWT cart) → `POST /wp-json/wc/store/v1/checkout` → Mollie iDEAL redirect URL. ~3-4 s end-to-end.
  - `test` — probe mode: cycles all 8 ATC variants (REST, 4× wc-ajax, admin-ajax, 2× GET-trick), reports which return non-error responses + which write to JWT vs PHP-session cart. Used to validate which paths survive a real Queue-Fair drop.
- Transport: nodriver Chrome with the page's woo-shield-plugin signer running natively — `x-bc` / `x-timestamp` / `x-signature` headers added transparently by in-page JS, no reverse engineering of the per-session rotation offset needed.
- Inline Cloudflare Turnstile clearance (pyautogui-driven checkbox click). Single browser handles CF + transport + cleanup.
- Proxy support including auth-required proxies via a built-in local asyncio relay (127.0.0.1:N) that injects `Proxy-Authorization` on the way out — Chrome never sees the credentials and never pops up the auth dialog.
- Both Cart-Token JWT cart and PHP-session cookie cart tracked; final JWT priming step before checkout so the order is created against the populated cart regardless of which ATC method got through.

## v1.4.5 — Elbenwald checkout fix

- **ATC**: added `redirectTo=frontend.detail.page` + `redirectParameters={"productId":...}` — both are required by the Shopware storefront controller. Without them the line item was silently dropped (false-positive 200 OK).
- **Captcha bypass**: snapshot session cookies before submitting the FriendlyCaptcha solution; restore everything except `datadome` / `ddgl` / `dd_*` / `link11*` after. Link11's response was issuing a fresh guest `session-*` cookie that was wiping the logged-in session — cart appeared empty, checkout redirected to `/checkout/register`.
- **Checkout**: switched to **PayPal Express** path. One POST to `/paypal/express/create-order` returns the PP token; the approval URL is built directly. Skips `/checkout/confirm` GET + `/checkout/order` POST entirely. 422 on the same call doubles as a cart-empty / OOS signal (caller retries ATC).
- **Clear cart on start**: fixed `ew_clear_cart` (regex was looking for a non-existent form field) and called once after login — otherwise stale stackable line items accumulated qty across runs and PayPal showed the cumulative quantity.
- Removed `X-Requested-With: XMLHttpRequest` from ATC POSTs (Shopware sends a different response shape with it).

## v1.4.4 — Empik monitor rewrite

- Empik price monitor now makes **one** request per tick: a minimal GraphQL `getProduct.bestOffer` query (~170 B response).
- REST `/api/product` and all HTML fallbacks removed from the monitor — both served multi-hundred-KB CF challenge pages on rate-limit, costing up to 225 MB/h of garbage traffic.
- On GQL 403/429/503 the session raises and rotates to a fresh proxy via the existing ban handler instead of hammering the banned IP.
- Product name shown in logs is parsed from the URL slug (no separate name-lookup call).
- Net: ~450× less monitor bandwidth on long runs.

## v1.4.3 — Games Island + bandwidth savings

- New module: **games-island.eu** ([Games Island](/sites/gamesisland)) — JTL-Shop 5 store for TCG / tabletop / board games.
- Pure-Python solver for **in-Reach CBF** (CapJS WebAssembly PoW) — ~0.15–0.3 s, no browser.
- Register + auto-saved address + reCAPTCHA v2 via CapSolver.
- Buy flow with monitor, empik-style price check, 404 retry, ATC retry on OOS / insufficient quantity.
- Checkout with **Vorkasse / bank transfer** as a single consolidated POST (shipping + payment + final submit in one request).
- **Empik monitor**: dropped the full-HTML fallback. Price check now uses REST API → GQL `getBestOffer` only. Per-hour proxy usage during long monitor runs capped at ~2–4 MB instead of spiking to ~480 MB when the REST API was missing price fields.
- **Empik buy flow**: removed the 50× ATC retry loop. On ATC or checkout failure, task returns to price monitoring instead of re-fetching the product page up to 40 MB worth of times.
- **BasketballEmotion + FutbolEmotion**: drop-wait loop now uses `HEAD` requests (0-byte body). Full page is fetched once, when the drop actually goes live. ~800× less bandwidth while waiting.

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
