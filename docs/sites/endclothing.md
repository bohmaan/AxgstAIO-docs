# END. Clothing

Pure-HTTP module for **endclothing.com** with full Adyen 3DS2 handling — when the issuer requires a challenge, the bot auto-opens the bank's ACS page in your default browser and waits for the result so the card actually gets charged.

**Region:** UK / EU
**Modes:** `buy`, `preload`, `register`, `login`
**Payment:** Credit/Debit Card (Adyen). 3DS2 challenge opens in your default browser.

## CSV row

```csv
end;https://www.endclothing.com/eu/<slug-sku>.html;buy;1;;500;3;guest@example.com;password;UK 11;John;Doe;+447700123456;221B Baker Street;;London;NW1 6XE;Greater London;GB;4111111111111111;12/29;123
```

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
- `preload` — pre-warms a logged-in session and caches the order body. Hot commit on drop runs only ATC + place_order. On OOS, falls back to restock polling.
- `register` — creates an END. customer account from the CSV row.
- `login` — verifies the CSV credentials work (no order placed).

## 3DS2 handoff

When Adyen returns a challenge:

1. Bot decodes the action token and builds the CReq blob.
2. Writes an auto-submitting HTML form to a temp file and opens it in your default browser.
3. You complete the SCA prompt (SMS / biometric / app) in the bank's challenge page.
4. ACS posts the result back; bot submits it to Magento; order is finalised.

## Restock polling

When the target's variant is OOS, the bot polls the PDP for the requested sizes. Every poll prints a status line — `countdown until <release>` for unreleased drops, or `OOS — waiting` for sold-out variants. On restock, bot fires exactly one ATC attempt to avoid rate limits, then moves to checkout.
