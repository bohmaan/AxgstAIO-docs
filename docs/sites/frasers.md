# Frasers (Sports Direct, GAME UK, Flannels...)

Every site on Frasers Group's commerce platform shares the same backend, so they're handled by a single multi-site module. The bot does **full guest checkout to a PayPal redirect URL** (when address fields are filled in CSV) — otherwise it falls back to holding the size in the basket and webhooking the cart link.

**Region:** United Kingdom (delivery primarily to GB; some sites accept EU addresses)
**Modes:** `buy`
**Payment:** Credit/Debit Card (Stripe + 3DS challenge opens in browser) **or** PayPal (automated redirect URL via webhook). The bot picks Card if `card_number` is filled in the CSV row, otherwise PayPal. Falls back to manual basket handoff if address fields are missing.
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

**For PayPal automation:**

- `email`
- `first_name`, `last_name`
- `street` (optionally `building_number`)
- `city`, `postal_code`
- `country_code` (e.g. `GB`)
- `phone` (recommended for delivery updates)

**For Credit/Debit Card automation** (in addition to all PayPal fields):

- `card_number` — pan with or without spaces
- `card_exp` — `MM/YY` or `MM/YYYY`
- `card_cvv`

If `card_number` is set, the bot tokenizes the card directly with Stripe (using the public key fetched from the live `/payment/setmethod` response), submits the resulting `pm_…` token to GAME's completion endpoint, and either:

- finishes the order outright (issuer skipped 3DS), or
- captures the 3DS / SCA challenge URL, opens it in the user's default browser (matching the BasketballEmotion / FutbolEmotion 3DS flow), and webhooks the same URL as a fallback.

If any required field is missing the bot finishes ATC and webhooks the basket URL for manual completion.

## Modes

- `buy` — poll PDP, ATC, full guest checkout via `/api/checkout/v2/*` flow, then either Card (Stripe + 3DS) or PayPal redirect URL.
