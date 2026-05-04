# Changelog

What changed in each release. For the raw commit log, see the [GitHub releases](https://github.com/bohmaan/AxgstAIO/releases).

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
