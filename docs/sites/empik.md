# Empik

**Code:** `empik` (also the default when `site` column is empty)

## Region

Poland only.

## Sample CSV

<div class="download-box">

- 📄 [empik-buy.csv](/samples/empik-buy.csv)

</div>

## Buy row

Use semicolon delimiter — Empik URLs contain commas.

```csv
empik;https://www.empik.com/harry-potter-a-kamen-mudrcu,p1047862,ksiazka-p;buy;1;200;3;you@mail.pl;P4ss;;PL
```

## Known issues

| Error | Cause |
|-------|-------|
| `Checkout failed — product page error` | URL malformed or product discontinued |
| `Waiting for restock` | Out of stock; edition may still be in print |
