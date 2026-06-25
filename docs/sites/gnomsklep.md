# Gnom-Sklep

**Code:** `gnomsklep` (aliases `gnom`, `gnom-sklep.pl`)
**Region:** Poland
**Modes:** `buy`
**Payment:** Card via IdoPay — **pay link forwarded to your webhook**
**Notes:** Tabletop / Warhammer / card-game shop. Ships InPost Kurier. Fill the address columns; no card columns needed (you pay via the link).

## CSV row

```csv
gnomsklep;https://gnom-sklep.pl/pl/products/example-18521;buy;1;;500;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Modes

- `buy` — add to cart, guest address, InPost Kurier, place order, get the IdoPay pay link.
