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

## Known issues

| Error | Cause |
|-------|-------|
| `Login failed — credentials` | Wrong email/password |
| `No delivery address — register first` | Account has no saved address yet |
| `Out of stock` | Item OOS — retries every `delay_sec` until restock |
