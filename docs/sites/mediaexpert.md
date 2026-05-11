# Mediaexpert

**Code:** `mediaexpert` (alias `me`)
**Region:** Poland
**Modes:** `buy`, `backend`, `preload`
**Payment:** Card via Tpay — payment URL delivered in webhook
**Notes:** Cloudflare-protected. Guest checkout — no account required.

## CSV row

```csv
mediaexpert;https://www.mediaexpert.pl/example,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Sample CSV

- [mediaexpert-buy.csv](/samples/mediaexpert-buy.csv)

## Modes

### `buy` (default)

Cold-start: PDP poll → ATC → parallel checkout (postcode + transport in parallel, payment + consents in parallel) → place order → webhook the Tpay payment link. ~1.5–2 s on a warm proxy. Use this for normal drops or restocks where you don't know the offer_id ahead of time.

### `backend`

Same end result as `buy` but every checkout step runs strictly sequentially — postcode → transport → payment → consents → address → summary → orders. Useful as a fallback when the parallel path 409s on cart version conflicts or when the proxy is rate-limited and parallel writes get throttled. Slightly slower than `buy` but more predictable.

### `preload` (drop-snipe)

Pre-warms the cart at task start with a stable dummy SKU and walks the checkout state machine all the way through the address step. Then polls ATC against the real `offer_id` until the SKU goes live, swaps the dummy out, and immediately places the order. Time-from-live to order hash is **~150–300 ms** (vs ~1.5 s on cold `buy`).

**CSV layout for `preload`:**

| Slot | Field | Meaning | Required |
|------|-------|---------|----------|
| 5 | `sizes` | Real `offer_id` (numeric) — direct ATC, skips PDP polling | yes |
| 7 | `delay` | Polling cadence in seconds (floor 0.5s) | recommended |
| 25 | `discount` | Dummy `offer_id` (numeric) — a stable, cheap, in-stock SKU used to prime the cart while waiting | required |
| 2 | `url` | Optional fallback PDP URL — used only if `sizes` is empty (slower; PDP must already be live to parse `t_offer_id`) | optional |

**Example row:**

```csv
mediaexpert;https://www.mediaexpert.pl/real-product,id999;preload;1;317732001;5000;0.5;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;;;;317732222
```

Where `317732001` is the real drop SKU and `317732222` is the always-in-stock dummy.

**Recommended dummies:** Pick a low-priced AGD/RTV accessory that's always in stock and you don't mind seeing in cart logs — cables, generic chargers, hygiene items. Verify the dummy `offer_id` is truly always-in-stock before relying on it for a drop.

**Flow:**

1. **Warm phase (t<0):** ATC dummy → set postcode → set transport (kurier) → set payment (card) → accept consents → post address. The dummy's `cart_item.hash` is cached on the session so the race-time remove is a single POST without a `/step/list` lookup. Cart is parked one step below summary so item PUTs still accept.
2. **Pre-drop poll (t<0):** PDP HEAD poll every `delay` seconds (default floor 1.0s). HEAD-on-`/<slug>,id<id>` is ~300–500 B/poll vs ~3 KB on a GET — about 6× cheaper bandwidth on long pre-drop windows. Falls back to GET-with-Range automatically if the host rejects HEAD (405/501).
3. **Race phase (t=0):** strictly serial — `PUT /api/carts/items` with the real offer_id (retries on HTTP 400 `Brak stanów magazynowych dla produktu.` while OOS) → `POST /api/carts/items/{cached_hash}/quantity {quantity:0}` (remove dummy, must 2xx-ack before next step) → `POST /api/carts/summaries` (advance to summary step) → `POST /api/mp/carts/orders` (place). The remove → ack → summary order is mandatory: a parallel remove+summary races on the server, and if summary lands first the captured checksum reflects `[dummy, real]` — `/carts/orders` happily ships the dummy.
4. **Webhook:** Tpay payment link `/payment/tpay/card-payment/<hash>`.

If the dummy POST fails the bot ABORTS before `/carts/orders` is ever called — no order is placed when the dummy might still be in cart.

## Payment methods

Mediaexpert offers multiple payment methods. The bot picks which one to use based on the `card_number` CSV column.

| `card_number` | Transport | Method | What you get |
|---|---|---|---|
| `4111…` (real PAN) | Kurier (3) | Tpay Card (`payment_id=61`) | Tpay payment URL in webhook |
| `gpay` / `googlepay` | Kurier (3) | Google Pay (`payment_id=538`) | Google Pay handoff URL |
| `cod` / `pobranie` / `zapobraniem` / `cashondelivery` | Kurier (3) | Gotówka przy odbiorze (`payment_id=41`) | Courier brings goods, you pay cash on arrival |
| `instore` / `odbior` / `pickup` | In-store pickup (1) | Pay at register (cash) | "Odbiór w sklepie" — pick up + pay cash at the store |
| `instorecod` / `instorecard` | In-store pickup (1) | Pay at register (card) | "Odbiór w sklepie" — pick up + pay by card at the store |

### Discovered `payment_id` table

Brute-forced against `PUT /api/mp/carts/payments` in v2.1.18. Accepted IDs at the time of mapping:

| `payment_id` | Name | Notes |
|---|---|---|
| 39 | Przelew internetowy (Tpay) | Bank transfer |
| 41 | Gotówka przy odbiorze | COD |
| 45 | BLIK | Polish instant payment |
| 61 | Karta płatnicza (Tpay) | Standard card |
| 63 | Raty (Tpay) | Installments |
| 529 | Apple Pay | |
| 538 | Google Pay | |

### Store selection for in-store pickup

`instore` / `instorecod` requires a physical store assignment after `transport_method=1` is set. The bot resolves it in this order:

1. **`discount` CSV column** — integer POS id (per-task override).
2. **`config.json` → `mediaexpert_default_pos_id`** — global default.
3. **env `HOP_ME_DEFAULT_POS_ID`** — CI / one-shot override.
4. **Automatic** — `GET /api/pos/list/search_nearest_by_cart` returns stores ranked by distance from the CSV `postal_code`; bot picks the first.

The POS id is then POSTed to `/api/carts/deliveries/pos/statuses` with `{"id": "<pos_id>"}` before summary + order placement.

**Example COD row:**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;cod;;;
```

**Example in-store-pickup-pay-by-card row (auto store selection by postcode):**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;instorecod;;;
```

**Example in-store-pickup with pinned POS id 1234:**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;instore;1234;;
```

## Payment methods

Mediaexpert offers multiple payment methods. The bot picks which one to use based on the `card_number` CSV column.

| `card_number` | Transport | Method | What you get |
|---|---|---|---|
| `4111…` (real PAN) | Kurier (3) | Tpay Card (`payment_id=61`) | Tpay payment URL in webhook |
| `gpay` / `googlepay` | Kurier (3) | Google Pay (`payment_id=538`) | Google Pay handoff URL |
| `cod` / `pobranie` / `zapobraniem` / `cashondelivery` | Kurier (3) | Gotówka przy odbiorze (`payment_id=41`) | Courier brings goods, you pay cash on arrival |
| `instore` / `odbior` / `pickup` | In-store pickup (1) | Pay at register (cash) | "Odbiór w sklepie" — pick up + pay cash at the store |
| `instorecod` / `instorecard` | In-store pickup (1) | Pay at register (card) | "Odbiór w sklepie" — pick up + pay by card at the store |

### Discovered `payment_id` table

Brute-forced against `PUT /api/mp/carts/payments` in v2.1.18. Accepted IDs at the time of mapping:

| `payment_id` | Name | Notes |
|---|---|---|
| 39 | Przelew internetowy (Tpay) | Bank transfer |
| 41 | Gotówka przy odbiorze | COD |
| 45 | BLIK | Polish instant payment |
| 61 | Karta płatnicza (Tpay) | Standard card |
| 63 | Raty (Tpay) | Installments |
| 529 | Apple Pay | |
| 538 | Google Pay | |

### Store selection for in-store pickup

`instore` / `instorecod` requires a physical store assignment after `transport_method=1` is set. The bot resolves it in this order:

1. **`discount` CSV column** — integer POS id (per-task override).
2. **`config.json` → `mediaexpert_default_pos_id`** — global default.
3. **env `HOP_ME_DEFAULT_POS_ID`** — CI / one-shot override.
4. **Automatic** — `GET /api/pos/list/search_nearest_by_cart` returns stores ranked by distance from the CSV `postal_code`; bot picks the first.

The POS id is then POSTed to `/api/carts/deliveries/pos/statuses` with `{"id": "<pos_id>"}` before summary + order placement.

**Example COD row:**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;cod;;;
```

**Example in-store-pickup-pay-by-card row (auto store selection by postcode):**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;instorecod;;;
```

**Example in-store-pickup with pinned POS id 1234:**

```csv
mediaexpert;https://www.mediaexpert.pl/product,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;instore;1234;;
```

**Sample log:**

```
[Mediaexpert] Mode: preload (warm cart with dummy, swap on live)
[Mediaexpert] Offer: 317732001 (from task.sizes)
[Mediaexpert] Warming cart: dummy=317732222
[Mediaexpert] Dummy added: 317732222
[Mediaexpert] Cart primed (postcode/transport/payment/consents/address)
[Mediaexpert] Ready (3.4s) — waiting for SKU live
[Mediaexpert] ATC poll #1: OOS Brak stanów magazynowych dla produktu.
[Mediaexpert] ATC poll #12: OOS Brak stanów magazynowych dla produktu.
…
[Mediaexpert] ATC poll #49: LIVE — offer=317732001
[Mediaexpert] Dummy removed
[Mediaexpert] Order placed: eaf76317511f48d7d02504e248fd0947
[Mediaexpert] Success (warm 3.4s + live→ordered 1600ms, total 32.5s)
```
