# Skatedeluxe

**Code:** `skatedeluxe` (alias `sd`)
**Region:** Germany / EU
**Modes:** `buy`, `register`
**Payment:** PayPal / card (manual handoff)
**Notes:** Account login required for checkout.

## CSV row

```csv
skatedeluxe;https://www.skatedeluxe.com/en/example;buy;1;42,43;200;3;guest@example.com;;;John;Doe;+491701234567;Hauptstrasse;10;Berlin;10115;BE;DE;;;
```


## Sample CSV

- [skatedeluxe-buy.csv](/samples/skatedeluxe-buy.csv)
- [skatedeluxe-register.csv](/samples/skatedeluxe-register.csv)

## Modes

- `buy` — login, monitor PDP, ATC, address + shipping, place order.
- `register` — create account with saved default address.
