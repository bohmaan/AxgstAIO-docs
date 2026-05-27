# END. Clothing

Pure-HTTP module for **endclothing.com** (Magento 2 V2 REST + Adyen Web Components 5.x card encryption + Akamai Bot Manager). Full Adyen 3DS2 dance is handled in-bot — when the issuer requires a challenge, the bot auto-opens the bank's ACS page in your default browser and waits for the CRes to come back so the card actually gets charged.

**Region:** UK / EU (`/eu/` store scope)
**Modes:** `buy`, `preload`, `register`, `login`
**Payment:** Credit/Debit Card via Adyen (RSA-OAEP + JWE encryption client-side). 3DS2 challenge opens in your default browser.
**Notes:** Akamai Bot Manager protects every storefront and api2 endpoint. Hyper Solutions sensor is required (config: `hyper_api_key`, optional `hyper_jwt_key`). Hot commit ~5–6 s end-to-end through a residential proxy.

## CSV row

```csv
end;https://www.endclothing.com/eu/<slug-sku>.html;buy;1;;500;3;guest@example.com;password;UK 11;John;Doe;+447700123456;221B Baker Street;;London;NW1 6XE;Greater London;GB;4111111111111111;12/29;123
```

PDP URL is `https://www.endclothing.com/eu/<slug>-<sku>.html`. The SKU at the end of the URL is the configurable parent — variant lookup happens automatically via the PDP's `__NEXT_DATA__` JSON.

## Sample CSV

- [endclothing-buy.csv](/samples/endclothing-buy.csv)

## Required CSV fields

- `email`, `password`
- `first_name`, `last_name`
- `street`, `city`, `postal_code`, `country_code`
- `phone`
- `card_number`, `card_exp` (`MM/YY` or `MM/YYYY`), `card_cvv`
- `sizes` — preferred sizes column (see below). Required for non-random picks.

## Size column

`sizes` accepts:

- Single label — `11`, `UK 11`
- Comma list (random pick order) — `10,11,12`
- Range (expanded to half-sizes, random pick order) — `11-12` → `11, 11.5, 12`
- Mix — `10,11-12,14`

**Strict by default.** If `sizes` is set and none of the requested labels are in stock, the bot will NOT fall back to other sizes — it parks on restock polling instead. Leave the column empty to allow random pick across every available variant.

## Modes

- `buy` — poll PDP, ATC, full checkout, place order, handle 3DS2 if challenged. Order is finalised on success; card is charged.
- `preload` — pre-warms a logged-in session, pre-builds the encrypted payment body, caches shipping. Hot commit on drop runs only `ATC(target) + place_order`. On OOS, falls back to restock polling.
- `register` — creates an END. customer account from the CSV row.
- `login` — verifies the CSV credentials work (no order placed).

## 3DS2 handoff

When Adyen returns `ChallengeShopper`:

1. Bot decodes `action.token` → extracts `acsURL` + `acsTransID` + `messageVersion` + `threeDSServerTransID`.
2. Builds the CReq blob, writes an auto-submitting HTML form to a temp file, and `webbrowser.open()`s it.
3. You complete the SCA prompt (SMS / biometric / app) in the bank's challenge page.
4. ACS POSTs CRes back; bot submits the result via `/eu/rest/V1/adyen/carts/mine/payments-details`; Magento finalises the order.

## Restock polling

When the target's variant is OOS, the bot polls the PDP's `__NEXT_DATA__` JSON for the requested sizes. Every poll prints a status line — `countdown until <release>` for unreleased drops, or `OOS — waiting` for sold-out variants. On restock, bot fires exactly one ATC attempt to avoid Akamai rate limits, then moves to checkout.

## Hyper Solutions

`endclothing.com` is on the Hyper Akamai sensor whitelist (verified 2026-05-26). One credit per task; ~3 iterations until the `_abck` threshold flips from `-1` to `0`.
