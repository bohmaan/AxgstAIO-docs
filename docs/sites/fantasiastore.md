# Fantasiastore

**Code:** `fantasiastore` / `fa`

## Region

Italy only. Currency EUR.

## Sample CSVs

<div class="download-box">

- 📄 [fantasiastore-buy.csv](/samples/fantasiastore-buy.csv)
- 📄 [fantasiastore-register.csv](/samples/fantasiastore-register.csv)

</div>

## Buy row

```csv
fa;https://fantasiastore.it/it/categoria/xxxxx-product-slug.html;buy;1;50;3;you@mail.it;P4ss;;IT
```

## Register row

```csv
fa;;register;1;0;0;new@mail.it;NewP4ss;;IT;Mario;Rossi;Via Roma;12;38121;Trento;+393331112233
```

## Checkout

- Shipping: **BRT** (carrier 259)
- Payment: **Bonifico bancario** (`ps_wirepayment`)

The `city` field should match the Italian province name (e.g. `Trento`, `Roma`, `Milano`) — the module maps it to the numeric PrestaShop `id_state`. All 110 provinces supported.

## Loop mode

`mode=loop` places one order, then immediately restarts (ATC → checkout → place order) — keeps running until you stop the task. Useful when you want to buy the same product repeatedly (one order per run).

```csv
fa;https://fantasiastore.it/it/categoria/xxxxx-product-slug.html;loop;1;50;3;you@mail.it;P4ss;;IT
```

Login happens once at start; only the buy iteration repeats.

## Known issues

| Error | Cause |
|-------|-------|
| `Login failed — credentials` | Wrong email/password |
| `No delivery address — register first` | Account has no saved address yet |
| `Out of stock` (ATC) | Item OOS in cart-add — retries every `delay_sec` until restock |
| `OOS at checkout — refresh in Xs` | Cart accepted the item but inventory is 0 — module auto-retries |
| `Address incomplete — fix at ...` | Saved address missing required field (phone/province). Update at `/it/indirizzi`. |
| `BRT shipping unavailable` | Product or zone excludes BRT — try a different carrier (GLS/FedEx currently not selectable via CSV) |
