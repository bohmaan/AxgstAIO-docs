# MediaMarkt DE

**Code:** `mediamarkt.de` (alias `mmde`)
**Region:** Germany
**Modes:** `buy`, `register`, `login`, `preload`
**Payment:** PayPal — handoff link to webhook
**Notes:** German MediaMarkt. Same flow as the NL store with a DE address.

## CSV row

```csv
mediamarkt.de;https://www.mediamarkt.de/de/product/example.html;buy;1;;500;3;guest@example.com;;;Max;Mustermann;+4915112345678;Hauptstrasse;10;Berlin;10115;BE;DE;;;
```

## Modes

- `buy` — add to cart, checkout, payment handoff link.
- `register` / `login` — manage the account.
- `preload` — warm session before a drop.
