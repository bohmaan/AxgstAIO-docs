# Boozt

**Code:** `boozt` (aliases `boozt.com`, `boozt.de`)
**Region:** DE / EU / CZ / IT
**Modes:** `buy`, `preload`
**Payment:** PayPal / card 3DS — **handoff link forwarded to your webhook**
**Notes:** Fashion. Region resolved by `country_code`. For card use the card columns; default is PayPal.

## CSV row

```csv
boozt;https://www.boozt.com/eu/en/example;buy;1;M,L;500;3;guest@example.com;;;Max;Mustermann;+4915112345678;Hauptstrasse;10;Berlin;10115;BE;DE;4111111111111111;12/30;123
```

## Modes

- `buy` — add to cart, address, payment handoff link.
- `preload` — warm session before a drop.
