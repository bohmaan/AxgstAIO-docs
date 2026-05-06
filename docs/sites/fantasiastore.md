# Fantasiastore

**Code:** `fantasiastore` (alias `fa`)
**Region:** Italy / EU
**Modes:** `buy`, `register`, `loop`
**Payment:** Card / PayPal (manual handoff)
**Notes:** Login required — register first or supply credentials.

## CSV row

```csv
fantasiastore;https://www.fantasiastore.it/example;buy;1;;200;3;guest@example.com;;;John;Doe;+390612345678;Via Roma;1;Roma;00184;RM;IT;;;
```

## Modes

- `buy` — monitor PDP, ATC, address + shipping, place order.
- `register` — create account with saved default address.
- `loop` — repeated buy attempts on the same task.
