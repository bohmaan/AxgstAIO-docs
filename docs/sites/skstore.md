# SK Store / WSS

**Code:** `skstore`
**Region:** Poland / EU
**Modes:** `buy`
**Payment:** Card / PayPal (manual handoff)
**Notes:** Guest checkout — no account required.

## CSV row

```csv
skstore;https://www.skstore.pl/example;buy;1;42,43;300;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```


## Sample CSV

- [skstore-buy.csv](/samples/skstore-buy.csv)

## Modes

- `buy` — monitor PDP, ATC, address + shipping, place order.
