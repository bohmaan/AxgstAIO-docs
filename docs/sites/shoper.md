# Shoper (generic)

**Code:** `shoper`
**Region:** Poland (any Shoper shop)
**Modes:** `buy`, `pickup`
**Payment:** Przelewy24 / Autopay card — **pay link forwarded to your webhook**
**Notes:** Generic module for any PL Shoper shop — set `site=shoper` and a full product URL of that shop. Locker delivery via a Paczkomat code in **`discount`**.

## CSV row

```csv
shoper;https://anyshopershop.pl/example-product;buy;1;;500;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Modes

- `buy` — add to cart, guest checkout, card payment link.
- `pickup` — InPost Paczkomat when `discount` holds a locker code.
