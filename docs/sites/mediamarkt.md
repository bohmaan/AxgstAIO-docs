# MediaMarkt

**Code:** `mediamarkt` (alias `mm`)
**Region:** Netherlands
**Modes:** `buy`, `register`, `login`, `preload`
**Payment:** PayPal / iDEAL — handoff link to webhook
**Notes:** Electronics. Use `register`/`login` for an account; `buy` checks out.

## CSV row

```csv
mediamarkt;https://www.mediamarkt.nl/nl/product/example.html;buy;1;;500;3;guest@example.com;;;Jan;Jansen;+31612345678;Damrak;1;Amsterdam;1012;NH;NL;;;
```

## Modes

- `buy` — add to cart, checkout, payment handoff link.
- `register` / `login` — manage the account.
- `preload` — warm session before a drop.
