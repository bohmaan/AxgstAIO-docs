# Changelog

What changed in each release. For the raw commit log, see the [GitHub releases](https://github.com/bohmaan/HopAIO/releases).

## v2.1.20 — Fast offline detection + richer batch embeds

- **Heartbeat 10s** (was 30s) — every CLI now pings the server every 10 seconds with active-task counts per site. The Live Sessions tab in the admin dashboard reflects up/down status within ~30 s of a bot crashing, losing network, or being closed.
- **Offline embed** — when the server reaper marks a session offline (last_seen older than `HOP_SESSION_OFFLINE_AFTER_S`, default 25 s), it now fires a red `CLI offline` embed to the ops Discord webhook so the operator sees the drop without watching the dashboard.
- **`batch_started` / `batch_finished` embeds carry sites + modes** — instead of one anonymous "Batch started — N tasks", the embed now lists per-site task counts (e.g. `mediaexpert:120, alza:30`) and per-mode counts (e.g. `Normal:80, COD:50, InStore:20`). Same for batch_finished so you can verify a hyped drop ran the modes you expected.
- **`cli_started` embed enumerates inputs** — System (OS + Python version), license tier, server URL, available CSV files in cwd + `tasks/` subdir, proxy count + filename, whether user / raffle webhooks are configured, monitor mode flag, QT mode flag. A glance at the embed tells you the bot is configured the way you intended.
- **Admin download from admin panel** — clicking "Download Bot" in the admin sidebar now works even when the operator is logged in via Discord OAuth (previously only license-key dashboard sessions could download). The admin session token is forwarded as a `?t=` query param.

## v2.1.19 — Operator-channel lifecycle embeds + Discord OAuth admin

- **Operator-channel lifecycle embeds** — bot lifecycle events (`cli_started`, `cli_stopped`, `batch_started`, `batch_finished`) now route to the ops Discord webhook (`HOP_OPS_SPAM_WEBHOOK`) in addition to the admin dashboard. Public success webhook (`HOP_PUBLIC_WEBHOOK_URL`) stays clean — it only fires for `checkout_success`.
- **Webhook routing crystallised:**
  - `checkout_success` → public webhook (anon, success-only) **and** user's configured `webhook_url` (full payload).
  - `cli_*` / `batch_*` / `ops` → ops spam webhook (operator visibility).
  - Failures → **never** webhook'd anywhere. Period.
- **Discord OAuth admin sign-in** — admin panel at `bohmannm.com/HopAIO Admin.html` now uses Discord OAuth instead of a static token. Requires `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `ADMIN_EMAIL` env vars on the server.

## v2.1.18 — Events pipeline rewrite + Mediaexpert COD / in-store pickup

- **Central event endpoint** — all CLI telemetry (start, heartbeat, batch start/end, checkout success, ops alerts) now flows through one POST to `/v1/events` on the license server instead of fanning out to multiple Discord webhooks from the bot. The server persists every event to SQLite + admin dashboard, then routes the lifecycle / success / ops subsets to their respective Discord channels.
  - One summary embed at batch start + one at batch end (no more per-task embeds spamming the channel).
  - Preloads count as tasks — preload prints unified `START` → "Preload finished" → normal OOS prints.
  - Each CLI run gets a `session_id`; license_key is written in to every envelope so the admin dashboard routes correctly.
  - File-backed buffer (`dashboard/data/events_buffer.jsonl`, 5000-line cap) drains on next successful POST when the server is unreachable.
- **Live Sessions tab** in the admin panel — every running bot shows with status pill (online / offline / stopped), version, machine id, active-tasks counter. Auto-refreshes every 8 s.
- **Events Feed tab** in the admin panel — chronological feed of every event with type filter chips, search box, color-coded rows.
- **Mediaexpert COD (Cash on Delivery)** — set `card_number=cod` in the CSV row. Bot uses `payment_id=41` (Gotówka przy odbiorze, courier delivery — pay the driver in cash on delivery).
- **Mediaexpert in-store pickup** — two flavors via `card_number`:
  - `instore` — "Odbiór w sklepie", pay in cash at register.
  - `instorecod` — pickup, pay by card at register.
  Bot auto-selects the nearest store for the CSV `postal_code` via `/api/pos/list/search_nearest_by_cart`. Override with `config.json` → `mediaexpert_default_pos_id` (or env `HOP_ME_DEFAULT_POS_ID`); per-task override via the `discount` CSV column.
- **Mediaexpert payment ID discovery** — full `payment_id` table mapped via brute-force probe: 41 COD, 45 BLIK, 61 Card (Tpay), 529 ApplePay, 538 GPay. Documented for future module work.
- **Preload pool-collision fix** — `real_target_id` is now filtered from the OOS preload pool before `random.choice` picks a dummy, so the bot never adds the same SKU twice and trips `Maksymalna ilość produktów w koszyku` at remove time.

## v2.1.7 — Swatch new module (Adyen CC + PayPal)

- **New site: Swatch** (`sw` / `swatch`, `swatch.com`) — Salesforce Commerce Cloud (SFRA) storefront, Akamai BMP-protected. Buy mode does ATC, full SFRA shipping/billing chain, then either CC or PayPal handoff depending on whether the CSV row carries card fields.
- **Swatch CC checkout via Adyen Web Components** — server-side replication of the live React SPA's Adyen tokenisation: fetch pubkey from `checkoutshopper-live.adyen.com/checkoutshopper/v1/clientKeys/<key>`, encrypt card number/expiry/CVC with the same RSA-OAEP + A256CBC-HS512 JWE format the iframes use, then POST `dwfrm_payment_creditCardFields_adyenEncrypted*` blobs + the `adyenStateData` JSON to `/CheckoutServices-SubmitPayment` with `submit=submit-payment` (Swatch finalises the order in the same call). Detects 3DS/SCA challenge URLs in the response and webhooks them as a customer-completion link.
- **Swatch DHL shipping by default** — shipping method `STANDARD-DE` (DHL); GLS / UPS / in-store-pickup constants exposed in `SW_SHIPPING_METHODS` for future per-task overrides.
- **Swatch PayPal handoff fallback** — when no card data is in the CSV row, the bot calls `Paypal-GetPaypalOrderId`, returns a `paypal.com/checkoutnow?token=…` URL. The PayPal modal lets the customer pay with PayPal account or PayPal-hosted card form — both are auth-only ("hold") until the merchant captures.
- **Swatch Akamai integration** — `_abck` is refreshed via Hyper Solutions before every state-changing POST (same pattern as Frasers). Requires `swatch.com` on the hyper plan; the bot logs `Akamai: swatch.com not whitelisted on hyper plan` clearly when the plan is missing the domain.

## v2.1.6 — Elbenwald 3× faster + MyComics PDP fix

- **Elbenwald `buy` mode rewritten on `/store-api/*`** — total cart-touching time drops from ~3.3 s to ~1.0 s (≈3× faster) by replacing the storefront `/checkout/line-item/add` HTML-redirect path with a single `POST /store-api/checkout/cart/line-item` round-trip that returns the cart JSON for verify in one shot. Cart-clear is now `DELETE /store-api/checkout/cart` → 204 (instead of GET cart + N×DELETE per item).
- **Elbenwald PayPal handoff also moved to store-api** — `POST /store-api/paypal/express/create-order` shares the `sw-context-token` cart context with the new ATC so the PayPal session sees the same basket. The previous mixed flow (store-api ATC + storefront PayPal) lived in two different cart contexts and 500'd because PayPal saw an empty cart.
- **Elbenwald OOS detection** — `_atc_post` now distinguishes a real out-of-stock (`product-out-of-stock` error in the cart response) from a channel-hidden item (`available=false` with `stock>0`, no error, line item silently dropped). Both paths log a meaningful reason instead of the old generic `ATC: failed 200`.
- **Elbenwald no longer needs CSRF or Link11 captcha on the cart path** — `/store-api/*` skips the storefront's Link11 challenge entirely, so the captcha bank tokens stay reserved for register/login flows where Link11 actually fires.
- **MyComics PDP product_id parser fixed for the new Next.js storefront** — site moved to React Server Components on Vercel and the `wp_id` is now embedded as escaped JSON (`\"wp_id\":466624`) inside streaming chunks ~262–396 KB into the document. The old regex looked for the unescaped form in the first 32 KB and missed every PDP. New regex matches both forms; `_fetch_pdp` drops the Range header and does a full GET (`_product_cache` keeps re-runs free).
- **MyComics resolution alternatives investigated** — `/wp-json/wp/v2/product?slug=`, `/wc/store/v1/products?slug=`, and `/api/*` all return a hardcoded default (Alakazam id 409930) regardless of input — Vercel cache layer ignores query params, and cache-bypass headers (`Cache-Control: no-cache`, `X-Vercel-No-Cache`, timestamps, POST) don't help. Sitemap has URLs but no IDs. Body class / shortlink / og tags don't carry the post id either. Full-page HTML scrape is the only viable path.

## v2.1.5 — Alza payment links + checkout safety

- **Alza DE/AT/HU online card now webhooks the real `?x=<token>` URL** — for `paymentId: 216` (Kreditkarte/Kreditna kartica online) flows, SendOrder4 returns `ErrorLevel: 60` with `RedirectUrlOrderDetail: null` and the user-facing URL is generated by `/api/payment/v3/adyenpaymentform`. The bot now POSTs that endpoint with the basket OrderId and extracts `form.value[].RedirectUrlOrderDetail` (e.g. `…/order-details-595544353.htm?x=0232G411DYV395FDB3F97C7B4B6&aopid=595544353…`). Customers can finally open the link from a different browser to retry payment without being prompted to log in.
- **Alza CZ Holešovice keeps using `RedirectUrlOrderDetail`** — for card-on-pickup the SPA-returned URL already has the token. We follow the URL with the bot session and scrape the canonical link as a fallback if the token is missing.
- **Alza CheckOrder4 now treats `ErrorLevel ≥ 1` with `Message` as failure** — previously `≥ 4`, which let warnings like "Košík je prázdný" or per-month purchase limits silently pass through into SendOrder4. The bot now stops on the warning and reports the server's actual reason.
- **Alza hard-failure path** — CheckOrder4 / SendOrder4 errors that the browser flow can't fix (per-customer limit, OOS at the very last step, basket rejected) no longer fall through to the `_ship_manual` "manual basket" webhook with a misleading "Success" log. They now log `Order failed:` with the server's reason and webhook a failure event.
- **Alza public webhook on manual basket fallback** — `_ship_manual` was webhooking to the private channel only; now also sends the public Discord notification.
- **Alza `_send_order4` parser hardened** — surfaces the server's `Message` field on parse failure, tries multiple field-name variants (`OrderId`, `orderId`, `Id`, `OrderID`, `OrderNumber`, `orderNumber`), and falls back to a regex extraction over the raw body. On hard failure the error message includes the first 300 chars of the response so unknown shapes are diagnosable from the log.
- **Mediaexpert preload race phase reverted to serial** — the parallel `remove + summary` race could ship the dummy when summary won and `/carts/orders` accepted the [dummy, real] checksum (server does *not* 409 on a checksum that was valid at summary time). Race phase is now strictly `remove → ack → summary → place_order`, with an abort if the remove fails before `/carts/orders` is ever called.
- **Mediaexpert preload PDP poll uses HEAD** — pre-drop polling drops from ~3 KB to ~300–500 B per poll (~6× cheaper bandwidth). Falls back to GET-with-Range automatically if the host rejects HEAD (405/501).
- **Mediaexpert preload log labels normalized** — drop the `Preload:` prefix in favour of standard module action labels (`Mode: preload`, `Failed:`, `Cart primed`, `Dummy added:`, `Order placed:`, `Success`) matching the rest of the bot.
- **CatchYourCards module dropped** — removed from launcher dispatch and PyInstaller spec. The site's woo-shield-plugin signer requires a per-page rotated secret fetched from a queue-protected URL, making a pure-Python bypass impossible without a browser session driving Queue-Fair.

## v2.1.4 — Mediaexpert preload mode + Alza fixes

- **Mediaexpert `preload` mode (drop-snipe)** — pre-warms the cart at task start with a stable dummy SKU and walks the checkout state machine through the address step. At t=0 the bot ATC-polls the real `offer_id` until the SKU goes live, swaps the dummy out, and immediately places the order. Time-from-live to order hash drops to ~150–300 ms versus ~1.5 s on cold `buy`. CSV slots: `sizes` = real `offer_id`, `discount` = dummy `offer_id`. See [Mediaexpert / Modes](/sites/mediaexpert#modes).
- **Mediaexpert `backend` mode** — alternate sequential checkout path with the same end result. Useful as a fallback when the parallel `buy` path 409s on cart version conflicts or gets rate-limited on parallel writes.
- **Mediaexpert ATC retry on `curl: (28) Connection closed abruptly`** — `_atc` PUT is now wrapped in a 3-attempt retry with exponential backoff (1.5s → 3s → fail) instead of crashing on a flaky proxy / mid-request CF reset.
- **Alza CZ Order3 chain fixed** — bot now drives the full `SaveOrder3 → CheckOrder4 → SendOrder4` flow for CZ pickup (previously CZ stopped at /Order3.htm and webhooked a generic link). Live mapping captured the missing `CheckOrder4` precondition + the country-specific `consentId` (CZ uses `"2"`, DE/AT/HU use `"1"`) + the correct CZ `country_id` (`0`, was `1`). CZ pickup now webhooks `/my-account/order-details-<OrderId>.htm` like DE/AT/HU.
- **Alza Sec-Fetch headers fix** — `/Services/EShopService.svc/*` AJAX POSTs were sending session-level navigation headers (`Sec-Fetch-Dest=document`, `Mode=navigate`) which Cloudflare detects as inconsistent for an XHR request and 403s. `svc_post` now overrides per-request to fetch values (`Dest=empty`, `Mode=cors`, `Site=same-origin`) and strips `Sec-Fetch-User` + `Upgrade-Insecure-Requests`.
- **Alza ATC Referer fix** — `OrderCommodity` now sends the PDP URL as Referer (where the SPA fires it from in real flow), not the generic `/Order2.htm`.

## v2.1.3 — Multicart partial-OOS handling

- **Don't checkout with a half-filled basket** — when one product in a `+`-separated multicart URL is in stock and the other is OOS, the bot now keeps polling `/cart/add` until *every* requested `sizeVariantId` is confirmed live in the basket before moving to checkout. Per-iteration log only updates when the in-cart count changes (`1/2 in cart — waiting for the remaining 1`).

## v2.1.2 — Multicart + Checkout.com support

- **Multicart** — split the `url` field on `+` to ATC multiple products into the same basket on a single Akamai sensor token. Example: `https://www.game.co.uk/...417299#colcode=41729990 + https://www.game.co.uk/...857967#colcode=85796790`. The bot polls each PDP independently, fires one ATC POST with all line items, and runs one shared checkout flow.
- **Checkout.com NAS tokenization** — implemented for Frasers SKUs that route through Checkout.com instead of Stripe (Frames v3 format: 3 single-use `tok_…` tokens joined with commas, posted to `/payment/completeandconfirmorder` with `paymentReturnUrl` pointing at `/checkoutsp/cardverificationreturn/checkoutdotcom`). The Card flow now picks the right tokenizer based on the live `provider` field from `setmethod`.
- **SSL CA fix** — Stripe and Checkout.com tokenizers no longer use `urllib.request` (which trips `CERTIFICATE_VERIFY_FAILED` on Windows machines without a configured CA store). Both now reuse the curl_cffi session, which carries its own bundled CA bundle.

## v2.1.1 — Frasers polish

- **Akamai warmup fix** — `/basket` GET restored in the warmup phase so `_abck` cookie gets a real challenge before ATC. Resolves intermittent 403 on `/cart/add`.
- **Faster startup** — IP lookup runs in parallel with the homepage warmup, PDP first-poll skips the redundant probe (one fewer round-trip), Akamai solver capped at 3 iterations / 15 s.
- **Quieter logs** — debug-level lines (`Stripe pk loaded`, `Card token`, `Checkout session sid=…`, `Akamai sensor: ok`, etc.) removed from the success path.

## v2.1.0 — Frasers multi-site + CC checkout

- **Frasers Group expansion** — one [shared module](/sites/frasers) now covers GAME UK, **Sports Direct**, **Flannels**, **Studio**, **House of Fraser**, **USC**, and **Everlast**. Same `/api/checkout/v2/*` backend, same Akamai + Hyper Solutions sensor. UK + most EU shipping addresses supported.
- **Credit/Debit Card checkout** — bot tokenizes the card directly with Stripe (using the public key from `/payment/setmethod`) and posts the `pm_…` token to `/payment/completeandconfirmorder`. Non-3DS cards finish outright; 3DS / SCA challenges open in the user's browser (same flow as BasketballEmotion / FutbolEmotion).
- **PDP retry on 5xx / network errors** — game.py and mediaexpert.py both poll the PDP with a lightweight Range request (~4 KB) and retry on 5xx / 429 / network failures with per-attempt logging.
- **Headless CF solver rewrite** — `cf_headless.py` is now wait-only (no clicks), 75 s timeout, persistent profile. Stops the `cf_chl_rc_ni` retry loop on Solebox without needing CapSolver.

## v2.0.0 — Major rework

- New module: **Mediaexpert** (PL) — guest checkout + tpay card payment.
- **Trimmed module set** to 16 supported sites + Queue-it. Removed: catchyourcards, colorskates, dfn, footdistrict, ipzs, mueller, pagro, crocs.
- **Shared public webhook** — every successful checkout posts to one Discord channel (Title / Store / Product / Size / Method / Price / Mode). Failed checkouts not posted publicly. User webhooks add Account / Order ID / Payment URL.
- **Unified console output** — same event vocabulary, colors, and `[Site]` prefix across every module.
- **Unified CSV** — single header used by every module; card columns kept even where unused. Sample at `tasks.example.csv`.
- **Docs rewrite** — every site page in the same compact format (Code / Region / Modes / Payment / Notes / CSV row).

## v1.9.0 — Solebox + Proshop modules

### Solebox

- New module: [Solebox](/sites/solebox) (`solebox` / `sb`) — EU sneaker store.
- **`buy` mode** — login, hold the requested EU size, webhook the logged-in checkout link. Finish address + card in browser.
- **`register` mode** — creates the account and logs in. Subsequent `buy` tasks skip registration.
- **`login` mode** — verify credentials and refresh the cached session.
- Cloudflare-protected; bot handles CF challenges automatically.

### Proshop

- New module: [Proshop](/sites/proshop) (`proshop` / `ps`) — German/Austrian/Polish/Dutch electronics store.
- **`buy` mode** — fresh login, ATC, drives the checkout, webhooks the PayPal handoff URL.
- **`register` mode** — creates the account and writes the shipping address to the customer profile. Account is immediately ready for `buy`.
- **`addy_fix` mode** — for accounts without a saved address; logs in and posts the address form once.
- **Pickup mode** — `sizes=pickup` + `postal_code` finds the nearest DPD pickup shop.
- **Keyword monitoring** — put a keyword in the URL column instead of a product link; the bot polls Proshop search until a match appears.
- Multi-TLD: `.de`, `.at`, `.pl`, `.nl` — auto-detected from the product URL or set via the site code.

## v1.8.0 — Colorskates module (Greek Hypercenter shop)

- New module: [Colorskates](/sites/colorskates) (`colorskates` / `cs`) — Greek skate shop on the Hypercenter / osCommerce platform.
- **`buy` mode** — login (cached ~12h), ATC, shipping → payment via Cardlink (Alpha Bank ePOS). The bot self-submits the order to the Alpha Bank gateway and webhooks the resulting session URL — open it in a browser, enter card, done.
- **`register` mode** — full registration with address. reCAPTCHA v2 (invisible flavor) is solved via CapSolver.
- **`presolve` mode** — keeps a small bank of payment-page captcha tokens ready in the background so a buy task doesn't wait on CapSolver during a hyped drop. Bank size from `captcha_bank_size` in `config.ini`.
- Cloudflare passes via the shared `cf_solver` (same one Pagro uses).
- Cart is auto-cleared after login so a previous failed run doesn't stack stale lines onto the new order.

- New module: [SK Store / WSS](/sites/skstore) (`skstore` / `wss`) — both shops covered with one module. Guest checkout (no account needed), country-aware shipping (PL → InPost paczkomat; CZ/SK/DE/AT/HU/RO/LT → DHL Europa), discount codes, PayPal payment.
- **CapSolver presolve** for SK Store finalisation: the captcha is solved in the background while the bot fills address + payment, saving ~10–15s per order. Falls back to a manual finalise link if CapSolver is unavailable.
- [Footshop](/sites/footshop) tweaks: success webhook fires immediately after the order is created; CC vs COD is now picked from the CSV `card_number` column.
- Sites menu now lists every supported shop alphabetically.

## v1.6.4 — Skatedeluxe sizing fix + skateboard griptape bundling

- [Skatedeluxe](/sites/skatedeluxe): fixed an issue where every product looked OOS after a site update (sizes were being read from the old page layout).
- Skateboard decks now automatically include the required griptape in the cart.
- Cart is cleared at the start of every buy run, so a previous failed attempt no longer stacks duplicate lines onto the new order.
- Cleaner product names in the logs (no more `Shop … online | skatedeluxe` wrapper).
- More reliable success/failure detection at checkout — the bot no longer reports "Successful checkout" when the server actually bounced you back to the address or payment page.

## v1.6.3 — Skatedeluxe register: tolerate older CSVs

- Fix: the address-save step right after Skatedeluxe register no longer crashes when the CSV doesn't include a `date_of_birth` column. A placeholder is used instead.

## v1.6.2 — Skatedeluxe register endpoint

- Skatedeluxe split register and login on their backend. The bot was updated to use the new register endpoint, so creating accounts works again.

## v1.6.1 — Skatedeluxe register captcha update

- Skatedeluxe migrated their register-time captcha. The bot's CapSolver call was updated to match — registrations work again.

## v1.6.0 — Footshop module (COD home delivery + Prague pickup + register)

- New module: [Footshop](/sites/footshop) (`footshop` / `fs`) — covers both `footshop.cz` and `footshop.eu` with one module. CSV `country_code` picks the storefront (`CZ` → CZK, anything else → EUR).
- **`buy` mode** — home delivery via GLS courier with **Dobírka (cash on delivery)**.
- **`pickup` mode** — Prague store pickup (Footshop Praha — Na Příkopě, fallback QNS Store 28. října).
- **`register` mode** — creates the account; the address from the CSV is saved automatically on first checkout, so subsequent buys skip the address form.
- Login session is cached for ~6h.

## v1.5.4 — Pagro session self-heal

- [Pagro](/sites/pagro): cached sessions now recover automatically when the server has cleaned up the cart in the background. No more "no active cart" failures after the bot has been idle for a while.

## v1.5.3 — Skatedeluxe module (CC + bank transfer + register)

- New module: [Skatedeluxe](/sites/skatedeluxe) (`skatedeluxe` / `sd`).
- **`buy` mode** — credit-card checkout (card details from the CSV).
- **`bank` mode** — bank transfer / Vorkasse (DE addresses only).
- **`register` mode** — creates the account and saves the CSV address as the customer's default in one go, so subsequent buys go straight to checkout.
- Login session cached for 24h.

## v1.5.2 — Pagro speedups

- [Pagro](/sites/pagro): faster end-to-end buy flow with fewer requests per order. Saferpay redirect URL is fetched directly instead of going through fallbacks.
- Card brand (Visa / Mastercard) is now auto-detected from the CSV `card_number` column.
- Persistent login session — second buy on the same account skips both the Cloudflare solve and the login.

## v1.5.1 — Pagro module (card payment via Saferpay)

- New module: [Pagro](/sites/pagro) (`pagro` / `pg`) — Austrian shop. Buy + register modes.
- Card payment is finalised on Saferpay's hosted page — the bot posts the URL to your webhook, you complete the card step in a browser.
- Cloudflare Turnstile is solved automatically. Auth-required proxies are supported.
- A global cap of **5 simultaneous Cloudflare solves** prevents a large task fleet from overloading a small server. Tasks past the cap wait their turn.
- Out-of-stock items auto-retry at the CSV `delay` interval until restock.

## v1.5.0 — Elbenwald register mode

- New `register` mode for [Elbenwald](/sites/elbenwald) — pure HTTP, no browser needed. CapSolver is used for the register-time captcha.
- Login / ATC captcha is now solved locally (no CapSolver cost on every buy run — see v1.4.9).

## v1.4.9 — Faster local captcha solving (Elbenwald)

- [Elbenwald](/sites/elbenwald)'s FriendlyCaptcha is now solved **locally** in ~0.1–0.7s instead of going through CapSolver (~3–5s + per-solve cost). No CSV / config changes needed.

## v1.4.8 — Generic Queue-it module

- New module: [Queue-it (generic)](/sites/queueit) (`qit` / `queueit`) — paste any `*.queue-it.net` queue URL into the CSV and the bot waits in the queue, then sends the **pass link** to your webhook. Open it in a real browser within 1–5 min and you're past the queue.
- Works for any Queue-it customer (Supreme, Adidas, Ticketmaster, public-sector portals, …) — no per-site module needed.
- For full end-to-end automation through a queued site, prefer the per-site module (e.g. [IPZS](/sites/ipzs)) which handles queue + ATC + checkout in one task.

## v1.4.7 — IPZS module

- New module: [IPZS](/sites/ipzs) — Italian State Mint, numismatic & commemorative coin shop. Buy mode only — register the account manually on the site, then plug the credentials into the CSV.
- Handles Queue-it gating on hyped drops automatically.
- Out-of-stock retry — the bot keeps retrying ATC at the CSV `delay` interval, picking up live restocks during a drop.
- PayPal Express checkout — approval URL is sent to the webhook.

## v1.4.6 — CatchYourCards module

- New module: [CatchYourCards](/sites/catchyourcards) — Pokémon TCG / One Piece / Lorcana store. ~3–4 s end-to-end after Cloudflare clearance.
- `test` mode — probes all ATC paths and writes a debug log; useful during a real Queue-Fair drop to validate which paths still work.
- Auth-required proxies supported (no Chrome auth-dialog popup).
- Mollie iDEAL payment URL is sent to the webhook.

## v1.4.5 — Elbenwald checkout fix

- Order creation is now reliable — line items no longer silently dropped at checkout, cart no longer goes empty after captcha solve.
- Switched to PayPal Express — bot returns the PayPal URL on the webhook, you authorise to complete the order.
- Cart is cleared on each run so previous attempts don't stack onto the new order.

## v1.4.4 — Empik price monitor rewrite

- Long-running price monitors now use ~450× less proxy bandwidth per tick.
- Auto-rotates proxies on rate-limit / ban responses instead of hammering a dead IP.

## v1.4.3 — Games Island + bandwidth savings

- New module: [Games Island](/sites/gamesisland) — TCG / tabletop / board games store. Register + auto-saved address + reCAPTCHA v2. Checkout via Vorkasse (bank transfer).
- Empik price monitor: per-hour proxy usage on long monitor runs is now ~2–4 MB instead of ~480 MB.
- Empik buy: stops re-fetching the product page on every retry — falls back to the lighter price monitor.
- BasketballEmotion + FutbolEmotion: drop-wait loop is now ~800× lighter on bandwidth.

## v1.2.1 — Cleaner log output

- Removed debug prints, entry banners, and the PayPal URL from the console (still posted to webhooks).
- Unified log style across all modules: `Restored session` / `Found: <name>` / `Size: <x>` / `Successful checkout (Ns)`.
- No functional changes.

## v1.2.0 — Checkout reliability

- Eliminates the `order-token-expired` errors at place-order on Zalando.

## v1.1.9 — Faster Zalando checkout

- ~6 s faster end-to-end on Zalando — login + product fetch and several other steps now run in parallel.

## v1.1.8 — Experimental (rolled back in v1.2.0)

- Tried to skip a checkout step. Caused `order-token-expired` errors. Reverted.

## v1.1.7 — Better Zalando address detection

- Broader check for "address present" in Zalando checkout state. Folded into v1.2.1.

## v1.1.6 — Abort on login failure

- Tasks now abort immediately on login failure instead of pointlessly continuing to probe + ATC.

## v1.1.5 — Zalando login fix

- Fixed a Zalando login that started failing after a server-side change.

## v1.1.4 — Cleaner errors on flagged proxies

- Akamai-blocked responses now print a clear `halt` message instead of an unhandled exception.

## v1.1.3 — Zalando login back to web flow

- Mobile OAuth login was failing consistently with `XSRF validation failed`. Login is back on the stable web flow. Register still uses mobile.

## v1.1.2 — Update mechanism fix (WinError 183)

- Auto-update no longer fails with `Cannot create a file when that file already exists`. See [Updating](/guide/updating#winerror-183-cannot-create-a-file-when-that-file-already-exists) for the manual cleanup if you're still on v1.1.1 or older.

## v1.1.0–1.1.1 — Zalando mobile SSO

- First attempt at mobile-Android login flow for Zalando. Login still failed with XSRF — see v1.1.3 for the fix.

## v1.0.9 and earlier

Initial releases. Basic support for Zalando, SportsShoes, Empik, BasketballEmotion, FutbolEmotion. No auto-update.
