# Proshop

**Code:** `proshop` (alias `ps`)
**Region:** DE / AT / NL / DK (TLD detected from URL or `country_code`)
**Modes:** `buy`, `register`, `addy_fix`
**Payment:** Bank transfer / card (manual handoff)
**Notes:** Multi-storefront — TLD chosen from URL host or `country_code` column.

## CSV row

```csv
proshop;https://www.proshop.de/example;buy;1;;1000;3;guest@example.com;;;John;Doe;+491701234567;Hauptstrasse;10;Berlin;10115;BE;DE;;;
```


## Sample CSV

- [proshop-buy.csv](/samples/proshop-buy.csv)
- [proshop-register.csv](/samples/proshop-register.csv)

## Modes

- `buy` — monitor PDP, ATC, address + shipping, place order.
- `register` — create account with saved default address.
- `addy_fix` — overwrite the default address on an existing account.
