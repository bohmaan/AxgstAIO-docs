# Changelog

Version history and release notes. For the full commit log, see [GitHub releases](https://github.com/bohmaan/AxgstAIO/releases).

## v1.7.0 — SK Store + Warsaw Sneaker Store module

- New module `skstore` / `wss` covering both `skstore.eu` and `warsawsneakerstore.com` (shared backend). Guest checkout, address from CSV, country-aware shipping (PL → InPost paczkomat; CZ/SK/DE/AT/HU/RO/LT → DHL Europa), discount codes, PayPal payment.
- **CapSolver presolve mode** for the order-finalise reCAPTCHA v2: solver runs in a background thread starting right after the cart is created, overlapping the address + payment HTTP work. Saves ~10–15s per order. Up to 3 retries with fresh tokens before falling back to a manual finalise link.
- Webhook delivers the final `…/order/finish/<id>/<hash>` link — open it in a browser, log into PayPal, pay.
- Footshop tweaks: success webhook now fires immediately after order creation (no waiting for Adyen submit); CC-vs-COD picked from CSV `card_number` rather than country.
- Sites sidebar now lists every supported shop alphabetically.

## v1.6.4 — Skatedeluxe PDP option parser rewrite + skateboard griptape bundling + cart clear + cleaner name

- Skatedeluxe rewrote their PDP markup. The old `data-option-id="..." data-option-label="..." data-option-stock="..."` triple is gone — sizes now live inside `<select id="product-size-chooser" data-product-id="...">` with `<option value="<id>" data-id="<id>" data-in-stock="0|1">label</option>`. Bot's regex updated; the page also embeds an unrendered Twig template version of the same select (with `t.escape(...)` syntax), so the parser now requires the surrounding select to have a literal numeric `data-product-id` attribute.
- Removed the 200KB `Range` header on the PDP fetch — the size-chooser sits ~600KB into the ~1.9MB page now, and the truncated body was returning zero options (which the bot reported as OOS).
- Skateboard decks (`data-variation=deck`) auto-bundle a griptape that the server requires as a `children:[...]` array entry on `/api2/cart/items`. Bot now reads `<div id="product-griptape-choosen" data-product-id=".." data-product-option-id="..">` and submits the child alongside the deck.
- Cart is now cleared at the start of every buy run (GET `/api2/cart` → DELETE `/api2/cart/items/<id>` per item) so a previous failed attempt doesn't stack stale lines onto the new order.
- Product name no longer comes from `og:title` (which was wrapped in `Shop … online | skatedeluxe`). Uses `data-product-name` on `.product-grid` first, then `<h1>`, with HTML entities (`&quot;`, `&amp;`, …) unescaped.
- Payment-method sniff at `/checkout_payment.php` is now permissive (multiple regex patterns); if the list still comes up empty the bot falls back to a blind POST and lets the server validate, instead of bailing out with `Bank transfer unavailable for this address`.
- Buy mode now re-asserts the default address (idempotent legacy `address_book_process.php` POST) before ATC, so accounts whose register-time address didn't stick don't get silently bounced back to the address book.
- `_confirm_order` was previously returning the URL on any HTTP 200, which falsely reported "Successful checkout" when the server actually bounced to `/address_book_process.php`, `/checkout_shipping.php`, `/checkout_payment.php`, or `/login.php`. Those redirects are now detected and reported as a real failure; a real success requires either an order-number / Bestellnummer match in the body or a `checkout_success` / `order_complete` / `thank` segment in the final URL.
- `_select_shipping`, `_select_payment_bank`, `_select_payment_stripe`, and `_confirm_order` now include the `_token` CSRF field in their bodies (matches what `_save_address` already did) and a proper `Referer` header. Previously the server accepted the POST with HTTP 200 but silently re-rendered the same step rather than advancing — so the bot would think payment was selected when the cart was actually still on the payment page. Step success is now detected by the *final URL* after redirects (`checkout_payment` / `checkout_confirm` / `checkout_process`), not just by HTTP status.

## v1.6.3 — Skatedeluxe save-address: tolerate missing CSV `date_of_birth`

- Fix: `do_sd_register` crashed with `AttributeError: 'Task' object has no attribute 'date_of_birth'` after a successful register, because the Task dataclass has no such field. The address-save path now uses `getattr(task, "date_of_birth", "")` and falls back to the `1990-01-15` placeholder, so older CSVs without the column work as before.

## v1.6.2 — Skatedeluxe register endpoint: /api2/auth → /api2/customer

- Skatedeluxe split register off from `/api2/auth` (now login-only, returns `404 No matching account found` for new emails). Register moved to dedicated `POST /api2/customer` with the same JSON body shape (`email, password, firstname, newsletter, premiumclub, connectOrder, captcha`). Bot updated.

## v1.6.1 — Skatedeluxe register: Turnstile → reCAPTCHA v2

- Skatedeluxe migrated their register-time captcha from Cloudflare Turnstile to **invisible reCAPTCHA v2**. Bot now reads the sitekey from the `data-recaptcha` container on /en/login (was `data-sitekey="0x..."`) and solves via CapSolver `ReCaptchaV2TaskProxyLess` with `isInvisible: true`. Body field name unchanged (`captcha`), so the upstream `/api2/auth` register call works without further tweaks once the right token is supplied.

## v1.6.0 — Footshop module (COD home delivery + Prague pickup + register)

- New module: **footshop.cz** + **footshop.eu** ([Footshop](/sites/footshop)) — Czech / EU sneaker store, single GraphQL backend at `/<lang>/graphql/`. Two domains share the same module — CSV `country_code` selects: `CZ` → CZK / `www.footshop.cz`, anything else → EUR / `www.footshop.eu`.
- **`buy` mode** — home delivery via GLS courier, **Dobírka (cash on delivery)** payment. Uses `selectedDeliveryAddress` for accounts that already have a saved address (set automatically by the server on first checkout), so subsequent buys skip the address form.
- **`pickup` mode** — Prague store pickup (Footshop Praha — Na Příkopě, fallback QNS Store 28. října). Same flow as `buy`, just a different carrier picker.
- **`register` mode** — pure-JSON GraphQL `Registration` mutation. Address is NOT submitted at register; the server stores it from the first `buy`/`pickup` checkout and the bot reuses the customer-saved address for subsequent runs.
- Anti-bot: none observed. Cloudflare only routes (no Akamai / Datadome / PX / Turnstile). `curl_cffi chrome146` impersonation is enough.
- Persistent login session (~6h TTL) in `~/.axgst/sessions/footshop_<hash>.json`.
- Single home GET + single PDP HTML scrape (server-rendered availability JSON gives all sizes + variant ids in one shot); everything else is GraphQL POSTs.

## v1.5.4 — Pagro restored-session cart self-heal

- Fix: restored sessions whose server-side quote was garbage-collected by Magento (typical after long idle) now auto-recover. ATC catches the `Current customer does not have an active cart` response, calls `POST /rest/V1/carts/mine` to create a fresh quote, and retries once. No extra request on the happy path.

## v1.5.3 — Skatedeluxe module (CC + bank transfer + register)

- New module: **skatedeluxe.com** ([Skatedeluxe](/sites/skatedeluxe)) — DE-based skate shop with `/api2/*` JSON backend.
- **`buy` mode** — Stripe credit-card checkout via direct `api.stripe.com/v1/payment_methods` tokenization (no Stripe.js iframe). Card brand auto-detected from CSV `card_number`.
- **`bank` mode** — bank-transfer (Vorkasse / moneyorder). DE addresses only.
- **`register` mode** — creates the account via `/api2/auth` (Cloudflare Turnstile solved with CapSolver) and saves the CSV address as the customer's default in one go, so subsequent buys skip the address step.
- Persistent login session (24h TTL) — second buy on the same account skips login entirely.
- All-REST `/api2/*` ATC + tiny Range-limited PDP scrape; no full HTML page downloads.

## v1.5.2 — Pagro speedups + Saferpay PaymentPage discovery

- Confirmed Saferpay redirect endpoint: `POST /rest/V1/carts/mine/saferpay/payment/paymentpageinitialization` returns the `https://www.saferpay.com/VT2/mpp/PaymentSelection/Index/<token>` URL directly. Replaces the earlier guess-based fallback chain (REST V1 order → 5 candidate redirect endpoints → success page scrape).
- All-REST-V1 buy flow — no HTML PDP fetch, no form-based ATC, no form_key cookie dedupe. Single `POST /rest/V1/carts/mine/items` with `{cartItem: {sku, qty}}` does add-to-cart and surfaces OOS via Magento's 400 message.
- SKU is extracted from the URL slug (`...-<digits>.html`) — works for any pagro listing without per-product config.
- Persistent login session (`~/.axgst/sessions/pagro_<hash>.json`, ~6h TTL): subsequent buys skip the CF solve + login entirely. Cached shipping carrier/method also persists, saving the `estimate-shipping-methods` call on the second+ buy.
- Auto-detects card brand from `card_number` (Visa / Mastercard) and selects the matching `saferpay_visa` / `saferpay_mastercard` method.
- Default request timeout 30s, 4 retries with capped backoff. Connection errors print a single retry line per attempt.

## v1.5.1 — Pagro module (Magento 2 + Saferpay)

- New module: **pagro.at** ([Pagro](/sites/pagro)) — Austrian Magento 2 storefront. Buy + register modes.
- End-to-end Saferpay PaymentPage checkout — bot places the order via REST V1, fetches the Saferpay hosted-page URL, posts it to the webhook for the user to complete the card payment.
- Auto-detects card brand from CSV `card_number` and selects matching `saferpay_visa` / `saferpay_mastercard` method.
- Cloudflare interactive Turnstile solved via `cf_solver` (nodriver + pyautogui) — auth proxies supported through a local Proxy-Authorization forwarder, no extension needed.
- **Global cap of 5 concurrent CF solves** so a large task fleet doesn't overload a small VPS. Tasks past the limit wait their turn.
- Persistent login session (~6h TTL) — second buy skips CF solve + login entirely.
- All-REST-V1 buy flow — no HTML PDP fetch, no form_key / uenc dance, no section/load polls. Single `cartItems` POST handles ATC + OOS detection.
- OOS retry loop — Magento returns a clear "out of stock" message; bot retries at CSV `delay` until the item is back.

## v1.5.0 — Elbenwald register mode

- New `register` mode for [Elbenwald](/sites/elbenwald) — pure HTTP, no browser. Posts to `/account/register` with billing address; the form's hidden reCAPTCHA v3 token is solved via CapSolver.
- Removed the legacy Selenium-based register path (no more `undetected-chromedriver` / Chrome dependency for Elbenwald registration).
- CapSolver fallback for FriendlyCaptcha (login / ATC) **removed** — only the local pure-Python BLAKE2B PoW solver from v1.4.9 is used now. CapSolver is still required for register-time reCAPTCHA v3.

## v1.4.9 — local FriendlyCaptcha solver (Elbenwald)

- Elbenwald's FriendlyCaptcha is now solved **locally** in pure Python (~0.1-0.7s on a modern CPU) instead of through the CapSolver API (~3-5s + per-solve cost).
- CapSolver stays as a fallback in case a site rolls to FriendlyCaptcha v2 (which uses a different protocol the local solver doesn't support yet).
- No CSV / config changes needed — drop-in.

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
