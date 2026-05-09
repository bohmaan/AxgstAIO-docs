# Frasers (Sports Direct, GAME UK, Flannels...)

Every site on Frasers Group's commerce platform shares the same backend, so they're handled by a single multi-site module. The bot does **full guest checkout via Credit/Debit Card** (Stripe tokenization + 3DS challenge in browser) when card fields are filled in the CSV — otherwise it falls back to holding the size in the basket and webhooking the cart link.

**Region:** UK / EU (delivery primarily to GB; the Frasers platform also accepts most EU addresses depending on the SKU)
**Modes:** `buy`
**Payment:** Credit/Debit Card (Stripe + 3DS challenge opens in browser). Falls back to manual basket handoff if address or card fields are missing.
**Notes:** Akamai Bot Manager protects PDP/ATC. Hyper Solutions sensor token is needed (config: `hyper_api_key`, optional `hyper_jwt_key`). PDP polling uses Range requests (~3-4 KB) for upcoming products with retries on 404/410/500/502/503/504/429.

## Modules covered

| Module | Code | Domain |
|---|---|---|
| GAME UK | `game` (alias `gameuk`) | game.co.uk |
| Sports Direct | `sportsdirect` (alias `sd_uk`) | sportsdirect.com |
| Flannels | `flannels` | flannels.com |
| Studio | `studio` | studio.co.uk |
| House of Fraser | `houseoffraser` (alias `hof`) | houseoffraser.co.uk |
| USC | `usc` | usc.co.uk |
| Everlast | `everlast` | everlast.com |

## CSV row

```csv
sportsdirect;https://www.sportsdirect.com/<slug>-<productid>;buy;1;;200;3;guest@example.com;;;John;Doe;+447700123456;221B Baker Street;;London;NW1 6XE;Greater London;GB;;;
```

PDP URL with `#colcode=...` fragment is also accepted — the colcode wins over the dataLayer's `colourVariantId`. Replace the `sportsdirect` site code with any of the codes above to target a different Frasers domain.

## Sample CSV

- [game-buy.csv](/samples/game-buy.csv)

## Required CSV fields

- `email`
- `first_name`, `last_name`
- `street` (optionally `building_number`)
- `city`, `postal_code`
- `country_code` (e.g. `GB`)
- `phone` (recommended for delivery updates)
- `card_number` — pan with or without spaces
- `card_exp` — `MM/YY` or `MM/YYYY`
- `card_cvv`

The bot tokenizes the card directly with Stripe (using the public key fetched from the live `/payment/setmethod` response), submits the resulting `pm_…` token to the Frasers completion endpoint, and either:

- finishes the order outright (issuer skipped 3DS), or
- captures the 3DS / SCA challenge URL, opens it in the user's default browser (matching the BasketballEmotion / FutbolEmotion 3DS flow), and webhooks the same URL as a fallback.

If any required field is missing the bot finishes ATC and webhooks the basket URL for manual completion.

## Multicart

Frasers' platform accepts multiple line items in a single basket on the same Akamai sensor token, which lets the bot snipe several products in one session. Split the `url` field on `+` to ATC multiple SKUs into the same basket, then the bot runs **one shared checkout flow** (single Stripe tokenization, single 3DS handoff) for all of them.

```csv
sportsdirect;https://www.sportsdirect.com/<slug-a>-417299#colcode=41729990 + https://www.sportsdirect.com/<slug-b>-857967#colcode=85796790;buy;1;;200;3;guest@example.com;;;John;Doe;+447700123456;221B Baker Street;;London;NW1 6XE;Greater London;GB;;;
```

- Each PDP is polled independently (separate Range requests, separate retry-on-404/410/5xx loops). Polls run concurrently — no single PDP blocks the others.
- ATC fires one POST with all `sizeVariantId` line items together. The bot keeps polling `/cart/add` until *every* requested SKU is confirmed live in the basket before moving to checkout — no half-filled-basket checkouts.
- The per-iteration log only updates when the in-cart count changes (`1/2 in cart — waiting for the remaining 1`), so a long pre-drop wait stays quiet.
- One product going OOS at the very last moment doesn't cancel the others: the bot keeps polling that SKU while the rest stay parked in the basket. If the OOS product never returns, the bot eventually times out and the user can manually clear the cart.

Multicart works on every Frasers domain in the table above (use the same site code in column 1 — the URL TLDs route per-line internally).

## Modes

- `buy` — poll PDP, ATC, full guest checkout via `/api/checkout/v2/*` flow, Stripe tokenization + 3DS handoff in browser. Accepts a single PDP URL or a `+`-joined multicart URL.
