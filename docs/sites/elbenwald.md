# Elbenwald

**Code:** `elbenwald` (alias `ew`)
**Region:** Germany / EU
**Modes:** `buy`, `register`, `login`, `presolve`, `force`, `test`
**Payment:** Card / PayPal (manual handoff)
**Notes:** Cloudflare Turnstile on login and checkout — requires CapSolver key.

## CSV row

```csv
elbenwald;https://www.elbenwald.de/p/example;buy;1;M,L;200;3;guest@example.com;;;John;Doe;+491701234567;Hauptstrasse;10;Berlin;10115;BE;DE;;;
```


## Sample CSV

- [elbenwald-buy.csv](/samples/elbenwald-buy.csv)
- [elbenwald-register.csv](/samples/elbenwald-register.csv)

## Modes

- `buy` — monitor PDP, ATC, address + shipping + payment, place order.
- `register` — create account with saved default address.
- `login` — verify saved login session.
- `presolve` — keep a Turnstile token warm in the background.
- `force` — skip stock check, push ATC immediately.
- `test` — dry-run flow without committing the order.
