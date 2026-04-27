# IPZS

**Code:** `ipzs`

## Region

Italy. Currency EUR. Site: [shop.ipzs.it](https://www.shop.ipzs.it/).

Istituto Poligrafico e Zecca dello Stato — Italian State Mint and Polygraphic Institute. Commemorative coins (silver, gold, bi-metallic), commemorative & numismatic series, philatelic products. Italian-resident accounts only — register your account manually on the site, then plug the credentials into the CSV.

## Sample CSV

<div class="download-box">

- 📄 [ipzs-buy.csv](/samples/ipzs-buy.csv)

</div>

## Buy row

```csv
ipzs;https://www.shop.ipzs.it/en/<product-slug>.html;buy;1;500;3;you@mail.cz;YourPassword;;IT;Mario;Rossi;Via Roma;1;00100;Roma;+393331234567
```

The URL is the Magento PDP — any `shop.ipzs.it/en/<slug>.html` works. The `product_id` is parsed from `<input name="product" value="…">` on the PDP. ATC is form-based (Magento's standard `/checkout/cart/add/…` controller), checkout is REST V1 customer cart with bearer auth.

## Modes

| Mode | What it does |
|------|--------------|
| `buy` | Login → ATC (form-based, with OOS retry while Magento reports stock gone) → REST V1 `carts/mine/estimate-shipping` → `shipping-information` → `payment-information`. PayPal Express token returned to webhook. ~3-5 s end-to-end when not queued. |
| `test` | Login + PDP scrape + ATC; **no order placed**, no payment. Writes `ipzs_debug_<ts>_<task_id>.log` with each step's status. |

## Anti-bot stack

| Layer | Mechanism | Module response |
|-------|-----------|-----------------|
| **F5 BIG-IP ASM** | TLS-fingerprint + behavioural WAF (`TS01…` cookie + `NCC` token) | curl_cffi Chrome impersonation handles TLS; cookies seed naturally on first warm GET |
| **Queue-it** | `ipzs.queue-it.net` SaaS queue, JS-driven polling, server-signed `QueueITAccepted-{customer-prefix}-V3_{event_id}` cookie issued on passage | Pure-HTTP three-step passage (enqueue → poll status → GET redirect URL with `queueittoken`) — no browser, per-task only, never shared between tasks |
| **Magento form_key** | Per-render rotating CSRF token in cookie + form field; custom IPZS `form_key_hidden` adds a 32-char server-generated suffix | Both extracted live from each form-page HTML, posted unmodified |

## Checkout

- Login: form POST to `/customer/account/loginPost/` (the visible form — there's also a hidden checkout-mini form at `/login/` which Magento silently 200s without authenticating, so we explicitly target the right URL).
- After login, the bot fetches a customer Bearer token via `POST /rest/V1/integration/customer/token` — Magento on IPZS scopes `/rest/V1/carts/mine/*` to bearer auth, not session cookies (without it, `estimate-shipping-methods` returns `401 The consumer isn't authorized to access %resources`).
- Payment defaults to **PayPal Express** (`paypal_express`). Magento returns the order ID + PayPal token; the approval URL `https://www.paypal.com/checkoutnow?token=…` is posted to the webhook + printed in the console; user opens it to authorise.
- Fallback chain when PP Express isn't available for the cart: `braintree_paypal` → `braintree` → `checkmo`.
- All POSTs use `allow_redirects=False` so Magento flash messages (`Out of stock`, `Invalid email or password`, …) survive long enough for `/customer/section/load/?sections=messages` to read them — without this they'd be consumed by the redirect-target page render before we can see them.

## OOS handling

The buy flow wraps ATC in an unlimited retry loop while Magento reports the product as out of stock (`Product that you are trying to add is not available.`, `non disponibile`, `stock for the requested`, …). Each retry refetches the PDP for a fresh `form_key` + stock state, so live restocks during a drop are picked up automatically. `delay` in the CSV (column 6) controls retry interval — default 3 s. Non-OOS errors break out immediately so we don't hammer pointlessly.

## Known issues

| Error | Cause |
|-------|-------|
| `Out of stock` retried forever | Expected on hyped drops — IPZS releases sell out in seconds. The loop refetches PDP each cycle so it picks up restocks. Set `delay` in CSV to control retry interval. |
| `401 The consumer isn't authorized` on `estimate-shipping-methods` | Bearer token missing. Magento on IPZS scopes `/rest/V1/carts/mine/*` to customer-token auth, not session cookies — `_fetch_bearer_token()` runs after login. |

## Performance

- **buy** (no queue): ~3-5 s end-to-end (warm + login + ATC + 3× REST + PayPal handoff)
- **buy** (queue active): adds 30 s – 5 min depending on queue length; the request-based passage holds a single curl_cffi session through enqueue → poll → redeem
- Single curl_cffi session per task; no browser ever opened
