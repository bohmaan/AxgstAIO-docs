# FutbolEmotion

**Code:** `futbolemotion` (alias `fe`)
**Region:** Spain / EU
**Modes:** `buy`, `register`, `addressfix`
**Payment:** Card with Adyen 3DS
**Notes:** Card columns required for `buy`. 3DS challenge handled inline.

## CSV row

```csv
futbolemotion;https://www.futbolemotion.com/es/example;buy;1;42,43;300;3;guest@example.com;;;John;Doe;+34600123456;Calle Mayor;1;Madrid;28013;Madrid;ES;4111111111111111;12/30;123
```

## Modes

- `buy` — monitor PDP, ATC, address + shipping, Adyen-encrypted card payment.
- `register` — create account with saved default address.
- `addressfix` — overwrite the default address on an existing account.
