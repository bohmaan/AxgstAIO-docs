# Zalando

**Code:** `zalando` (alias `zal`)
**Region:** EU
**Modes:** `buy`
**Payment:** PayPal / Klarna / card (manual handoff)
**Notes:** Account login required. URL host picks the storefront (de/pl/cz/...).

## CSV row

```csv
zalando;https://www.zalando.de/example.html;buy;1;42,43;300;3;guest@example.com;;;John;Doe;+491701234567;Hauptstrasse;10;Berlin;10115;BE;DE;;;
```


## Sample CSV

- [zalando-buy.csv](/samples/zalando-buy.csv)

## Modes

- `buy` — login, monitor PDP, ATC, address + shipping, place order.
