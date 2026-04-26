# CatchYourCards

**Code:** `catchyourcards` / `cyc`

## Region

Netherlands. Currency EUR. Site: [catchyourcards.nl](https://catchyourcards.nl/).

Pokémon TCG / One Piece / Lorcana / Magic: The Gathering specialty store. WordPress + WooCommerce + Shoptimizer theme.

## Sample CSV

<div class="download-box">

- 📄 [catchyourcards-buy.csv](/samples/catchyourcards-buy.csv)

</div>

## Buy row

```csv
cyc;https://catchyourcards.nl/<product-slug>/;buy;1;50;3;you@mail.nl;;;NL;Test;Buyer;Hooftlaan 1;1000AA;Amsterdam;0612345678
```

The URL is the product page — any `catchyourcards.nl/<slug>/` works. The product ID is resolved via the WC Store REST API (`/wp-json/wc/store/v1/products?slug=…`); ID-prefixed slugs (`/12345-some-name/`) are recognised directly. Numeric IDs in column 2 are also accepted (use during pre-drop when only the ID is known).

## Modes

```csv
cyc;<url>;buy;…    # default — fastest path
cyc;<url>;test;…   # forensic probe — runs all 8 ATC variants
```

| Mode | What it does |
|------|--------------|
| `buy` | Single REST POST `/wp-json/wc/store/v1/cart/add-item` → JWT cart populated → `POST /wp-json/wc/store/v1/checkout` → Mollie iDEAL redirect URL → webhook. ~3-4 s end-to-end. Falls back through wc-ajax variants only if rest_store_api fails. |
| `test` | Empties cart between each method, tries all 8 ATC paths, logs which ones return non-error responses + which write to JWT vs PHP-session cart. After the probe, re-primes the JWT cart and runs checkout. Useful for validating which paths a real Queue-Fair drop lets through. |

## Checkout

- Payment: **Mollie iDEAL** (`mollie_wc_gateway_ideal`, default issuer `INGBNL2A`).
- Result: a real `https://pay.ideal.nl/transactions/…` URL is posted to your webhook + printed in the console — open it to authorise the payment.
- Other Mollie methods exposed by the shop (Apple Pay, Klarna, Credit Card, Bancontact, KBC) work too if you set `payment_method` in CSV; current default is iDEAL because it's the most common in NL.
- After ATC the item is reserved 5 min by the **Reserved Stock Pro** plugin — plenty of time to complete the iDEAL flow.

## Anti-bot stack

| Layer | Mechanism | Module response |
|-------|-----------|-----------------|
| **Cloudflare** | Turnstile challenge on first visit | Real Chrome via nodriver, pyautogui-driven checkbox click; `cf_clearance` cookie reused for the whole task |
| **woo-shield-plugin** | nginx-side rejection of unsigned POSTs (`x-bc` + `x-timestamp` + `x-signature`) | All requests go through `tab.evaluate(fetch(…))` so the in-page signer JS adds the headers natively — no offset reverse engineering |
| **Queue-Fair** (only on hyped drops) | JS-only adapter (no PHP plugin installed). Server doesn't validate the queue cookie. | Bot never visits the queued PDP. Resolves product ID via REST → ATC via REST → checkout via REST. Storefront pages (the only ones the queue gates) are bypassed entirely. |
| **WC Order Limiter** | Blocks rapid repeat orders from same email/IP (`wc_order_limiter_rate_limit_exceeded`) | Wait ~15 min or rotate email/IP between test runs |

## Proxy

Auth-required HTTP proxies are supported via a built-in local relay: the bot opens `127.0.0.1:N` in asyncio, Chrome connects there without auth, the relay injects `Proxy-Authorization: Basic …` and forwards to your real proxy. Chrome never shows an auth dialog.

Accepted formats:
- `host:port`
- `host:port:user:pass`
- `user:pass@host:port`
- `http://user:pass@host:port`

CF clearance binds to the proxy IP so the whole task (CF + ATC + checkout) is consistent on one egress.

## Probe / debug log

Each task writes `cyc_debug_<ts>_<task_id>.log` to the working dir with:
- request method + URL + status + latency
- `cf-cache-status`, `cf-ray`, `x-fastcgi-cache` (origin marker), `cf-worker` (Worker marker)
- response body preview (first 1.5 KB)
- queue-fair markers found in headers / body

During a real drop, run with `mode=test` and send the log — it tells us exactly which ATC paths the queue blocked vs let through, so we can pin the production module to the fastest survivor.

## Known issues

| Error | Cause |
|-------|-------|
| `Could not pass Cloudflare` | nodriver / pyautogui not installed in the same Python that runs `launcher.py`. Run `python -m pip install nodriver pyautogui websockets`. |
| `cf_solver error: maximum recursion depth` | nodriver 0.48 bug on Python 3.14. Pin: `pip install --force-reinstall "nodriver==0.46"`. |
| `wc_order_limiter_rate_limit_exceeded` | WP plugin blocking rapid repeat orders. Wait 15 min or change email/IP. |
| `URL redirects → product likely removed` | Site returned 301 → product was unpublished after a drop. Use a live product URL or a numeric ID known pre-drop. |

## Performance

- **buy mode**: ~3-4 s (CF clearance one-time = 5-10 s on first run; subsequent are ~3-4 s once the page is settled in the browser session)
- **test mode**: ~30 s (8 ATC × ~3 s each + cart-empty round trips)
- Single browser instance per task; closes automatically when checkout completes
