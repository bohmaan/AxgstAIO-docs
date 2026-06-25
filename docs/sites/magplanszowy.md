# Mag Planszowy

**Code:** `magplanszowy` (alias `magplan`)
**Region:** Poland
**Modes:** `buy`, `pickup`
**Payment:** Autopay — **pay link forwarded to your webhook**
**Notes:** Board-game shop (Shoper). Default InPost Kurier; put a Paczkomat code in **`discount`** for locker delivery.

## CSV row

```csv
magplanszowy;https://magplanszowy.pl/example-product;buy;1;;500;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Modes

- `buy` — courier to the address.
- `pickup` — locker delivery when `discount` holds a Paczkomat code.
