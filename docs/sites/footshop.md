# Footshop

**Codes:** `footshop` / `fs`

Covers both `footshop.cz` (CZK) and `footshop.eu` (EUR). The CSV `country_code` decides — `CZ` routes to the Czech storefront, anything else to the EU one.

## Sample CSVs

<div class="download-box">

- 📄 [footshop-buy.csv](/samples/footshop-buy.csv) — home delivery (GLS courier)
- 📄 [footshop-pickup.csv](/samples/footshop-pickup.csv) — Prague store pickup
- 📄 [footshop-register.csv](/samples/footshop-register.csv)

</div>

## Modes

### `buy` — home delivery, cash on delivery

```csv
fs;<pdp-url>;buy;1;5000;3;you@mail.com;YourPassword;42;CZ
```

GLS courier, **Dobírka (cash on delivery)** at the door. The `sizes` column accepts a single value (EU/US/UK auto-detected) or a comma-separated list — first match in stock wins.

### `pickup` — Prague store pickup, cash on delivery

```csv
fs;<pdp-url>;pickup;1;5000;3;you@mail.com;YourPassword;42;CZ
```

Same as `buy`, but the parcel waits at **Footshop Praha — Na Příkopě** (fallback **QNS Store 28. října**). The address from the CSV is still required for contact info.

### `register` — create an account

```csv
fs;;register;1;0;0;new@mail.com;NewP4ss;CZ;Jan;Novak;Hlavni;12;11000;Praha;+420777123456
```

The address from the CSV is **not** sent at register — Footshop saves it automatically on the customer's first checkout. The next `buy` on the same account skips the address form.

## Notes

- Login is cached for ~6h — repeated buys on the same account skip the login step.
- Carriers depend on `country_code`. The bot prefers GLS; if your country has no GLS or COD-compatible carrier, the run aborts with `COD not available (have: ...)`.
- Card / PayPal payments are not supported on Footshop — COD only.
