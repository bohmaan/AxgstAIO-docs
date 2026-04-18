# Empik

**Code:** `empik` (also the default when `site` column is empty)

## Region

Poland only.

## Sample CSVs

<div class="download-box">

- 📄 [empik-buy.csv](/samples/empik-buy.csv)
- 📄 [empik-register.csv](/samples/empik-register.csv)

</div>

## Buy row

Use semicolon delimiter — Empik URLs contain commas.

```csv
empik;https://www.empik.com/harry-potter-a-kamen-mudrcu,p1047862,ksiazka-p;buy;1;200;3;you@mail.pl;P4ss;;PL
```

## Register row

```csv
empik;;register;1;0;0;new@mail.pl;NewP4ss;;PL;Jan;Kowalski;Marszałkowska;1;00-001;Warszawa;+48501234567
```

Register uses Cloudflare Turnstile — requires a CapSolver key configured in settings.

## Known issues

| Error | Cause |
|-------|-------|
| `Checkout failed — product page error` | URL malformed or product discontinued |
| `Waiting for restock` | Out of stock; edition may still be in print |
| `Turnstile failed — cannot register` | CapSolver key missing or quota exhausted |
