# Dfn (Def-Shop)

**Code:** `dfn`

## Region

Ships EU-wide. Currency EUR.

## Buy row

```csv
dfn;https://www.defshop.com/product/xxx;buy;1;200;3;you@mail.de;P4ss;L;DE
```

## Known issues

- Some drops are region-locked to DE — returns `shipping not available` if ordering from outside.
- Sale items are excluded from PayPal; falls back to card-only (not supported).
