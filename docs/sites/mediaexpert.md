# Mediaexpert

**Code:** `mediaexpert` (alias `me`)
**Region:** Poland
**Modes:** `buy`
**Payment:** Card via tpay — payment URL delivered in webhook
**Notes:** Cloudflare-protected. Guest checkout — no account required.

## CSV row

```csv
mediaexpert;https://www.mediaexpert.pl/example,id123;buy;1;;5000;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```


## Sample CSV

- [mediaexpert-buy.csv](/samples/mediaexpert-buy.csv)

## Modes

- `buy` — monitor PDP, ATC, set address + delivery + card payment, place order, return tpay payment URL.
