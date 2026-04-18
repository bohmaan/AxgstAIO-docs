# FootDistrict

**Code:** `footdistrict` / `fd`

## Region

Ships across EU + UK. Currency EUR.

## Buy row

```csv
fd;https://footdistrict.com/en/products/new-balance-2002r;buy;1;200;3;you@mail.com;P4ss;42,43;ES
```

## Register row

```csv
fd;;register;1;0;0;new@mail.com;NewP4ss;Juan;Perez;Calle Mayor;1;28013;Madrid;ES;+34612345678
```

## Known issues

| Error | Cause |
|-------|-------|
| `Captcha failed` (register) | reCAPTCHA v3 score too low |
| `shipping not available` | Raffle sneakers often EU- or ES-only |
