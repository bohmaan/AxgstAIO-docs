# Tantis

**Code:** `tantis` (alias `tantis.pl`)
**Region:** Poland + EU lockers
**Modes:** `buy`, `pickup`
**Payment:** PayU — **order-confirmation link forwarded to your webhook**
**Notes:** Books / games / toys. Default = InPost Kurier to the address. For a parcel locker, put the locker code in the **`discount`** column (e.g. `SVA01M` for a PL Paczkomat, `ITFAN043743D` for an InPost International locker in Italy — brand auto-detected). No card columns needed.

## CSV row

```csv
tantis;https://tantis.pl/example-p3769093;buy;1;;500;3;guest@example.com;;SVA01M;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Modes

- `buy` — courier to the address, place order, get the PayU confirmation link.
- `pickup` — automatic when `discount` holds a locker code; ships to that InPost box instead.
