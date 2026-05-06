# Solebox

**Code:** `solebox` (alias `sb`)
**Region:** Germany / EU
**Modes:** `buy`, `register` (handoff)
**Payment:** Card 3DS (manual confirmation if challenged)
**Notes:** Card columns required for `buy`. Captcha-gated — requires CapSolver key.

## CSV row

```csv
solebox;https://www.solebox.com/en/example.html;buy;1;42,43;300;3;guest@example.com;;;John;Doe;+491701234567;Hauptstrasse;10;Berlin;10115;BE;DE;4111111111111111;12/30;123
```

## Modes

- `buy` — monitor PDP, ATC, address + shipping, card payment.
- `register` — semi-automatic; final captcha solved manually if shown.
