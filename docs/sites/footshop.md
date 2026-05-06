# Footshop

**Code:** `footshop` (alias `fs`)
**Region:** CZ / EU (storefront via `country_code`)
**Modes:** `buy`, `register`
**Payment:** Card / Apple Pay / bank transfer (manual handoff)
**Notes:** `country_code` column picks the storefront (CZ/SK/HU/PL/EU).

## CSV row

```csv
footshop;https://www.footshop.com/en/example;buy;1;42,43;300;3;guest@example.com;;;John;Doe;+420777123456;Vodickova;1;Praha;110 00;PR;CZ;;;
```

## Modes

- `buy` — monitor PDP, ATC, address + shipping, place order.
- `register` — create account with saved default address.
