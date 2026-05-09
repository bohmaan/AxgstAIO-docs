# Alza (CZ / DE / AT / HU)

Single shared `/Services/EShopService.svc/*` backend across `alza.cz`, `alza.de`, `alza.at`, and `alza.hu`. Hybrid stack: React-driven `/Order2.htm` (delivery + payment selection) on top of a classic ASP.NET WebForms `/Order3.htm` (customer info + final submit).

**Region:** CZ / DE / AT / HU
**Modes:** `buy`

## Storefronts covered

| Storefront | Site code | Currency | Delivery | Payment | What the user does |
|------------|-----------|----------|----------|---------|---------------------|
| `alza.cz` | `alza` / `alza.cz` | CZK | Showroom Praha 7 Holešovice (pickup) | Card on pickup (no online charge) | Open `/Order3.htm` link from webhook, fill email + name + phone, click Potvrdit nákup. Pay at the counter. |
| `alza.de` | `alza.de` | EUR | Lieferung an die Adresse | Kreditkarte online | Open `/my-account/order-details-…` link from webhook, enter card. |
| `alza.at` | `alza.at` | EUR | Lieferung an die Adresse | Kreditkarte online | Open `/my-account/order-details-…` link, enter card. |
| `alza.hu` | `alza.hu` | HUF | Kiszállítás a címre | Bankkártyás fizetés online | Open `/my-account/order-details-…` link, enter card. |

The same `alza` site code auto-detects the storefront from the URL TLD — `https://www.alza.de/<slug>-d<id>.htm` routes to the DE flow even when the CSV says `alza`.

## CSV row examples

```csv
# Holešovice pickup + card on pickup (CZ — no online charge)
alza;https://www.alza.cz/<slug>-d<id>.htm;buy;1;;3500;3;guest@example.com;;;;;;;;;;CZ;;;;;

# Home delivery + Kreditkarte online (DE — postal code required)
alza.de;https://www.alza.de/<slug>-d<id>.htm;buy;1;;100;3;guest@example.com;;;Max;Mustermann;+49170000000;Berliner Str. 5;;Berlin;10115;;DE;;;;

# AT — postal code required
alza.at;https://www.alza.at/<slug>-d<id>.htm;buy;1;;100;3;guest@example.com;;;Max;Mustermann;+43670000000;Mariahilfer Str. 1;;Wien;1010;;AT;;;;

# HU — postal code required
alza.hu;https://www.alza.hu/<slug>-d<id>.htm;buy;1;;30000;3;guest@example.com;;;Eva;Kovacs;+36300000000;Kossuth Lajos u. 1;;Budapest;1051;;HU;;;;
```

The `<id>` after `-d` is the product number Alza uses internally (e.g. `apple-airpods-4-d12541394.htm` → `12541394`). Copy the link straight from your browser address bar.

The `max` column (column 6 in the unified CSV) is the **price cap in the storefront's currency**. If the live PDP price is above the cap, the bot skips the row and posts a webhook noting the overshoot. Leave at `0` to disable the check.

## Required CSV fields

**Always**

- `url` — `https://www.alza.<tld>/<slug>-d<id>.htm`
- `mode` = `buy`
- `qty` (default 1)
- `max` (recommended) — price ceiling

**For DE / AT / HU only** (home delivery)

- `first_name`, `last_name`
- `street`
- `city`
- `postal_code` — **required**, drives the home-delivery route on the React Order2 form
- `phone`
- `email`

CZ pickup mode doesn't need address / phone — the bot leaves those for the user to fill in browser.

## What the bot automates

1. Polls the PDP via lightweight Range request (~200 KB head, JSON-LD product schema reads from there).
2. Cross-checks the live `offers.price` against your `max` cap and `offers.availability` for stock state.
3. POSTs `/Services/EShopService.svc/OrderCommodity` to add the SKU to the basket.
4. Probes `GetOrder2DeliveryInfo` to discover the cart's `groupId` (and `basketId` for international flows).
5. POSTs `SaveAndConfirmOrder2` with the country-specific `deliveryId` + `paymentId` (CZ Holešovice + paymentId 211 / DE/AT/HU home delivery + paymentId 216 = Kreditkarte online). For home-delivery flows the bot first calls `bestDeliveryData` to pick the recommended `deliveryTimeFrameId` for the postal code.
6. Drives the SOAP-style `Services/EShopService.svc/*` chain that the React/ASP.NET hybrid uses for the address step: **`SaveOrder3`** (writes customer info — `deliveryName`, `deliveryStreet`, `deliveryCity`, `deliveryZip`, `deliveryPhone` plus a country-specific `countryId` and `consentId`) → **`CheckOrder4`** (pre-flight basket validation; bot stops here if the server flags `ErrorLevel ≥ 1` with a `Message` — per-customer monthly limit, OOS at the very last step, basket rejected) → **`SendOrder4`** (actually creates the order; returns a basket-bound `OrderId`).
7. For DE/AT/HU online card flows (paymentId 216) the bot then POSTs `/api/payment/v3/adyenpaymentform?orderId=<basketOrderId>&type=scheme&…` and extracts the lowercase `redirectUrlOrderDetail` entry from the response's `form.value[]` array. That URL embeds the **public order number** (different from the basket-bound `OrderId`) plus the **guest access token** (`?x=<hex>`) — exactly the link the customer needs to open the order from a different browser without logging in. CZ pickup uses the `RedirectUrlOrderDetail` returned directly by `SendOrder4`.
8. Webhooks the resolved order-detail URL alongside the order id, price, and product image. On hard failures (CheckOrder4 / SendOrder4 rejects the basket) the bot webhooks a failure event with the server's actual reason — no misleading "Success" log.

## Modes

- `buy` — guest checkout. CZ goes to Holešovice + pay-on-pickup. DE/AT/HU goes to home delivery + online card; webhook URL points at the order-details page where the user enters card details (the page lets them retry from there if a payment attempt fails).
