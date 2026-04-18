# SportsShoes

**Code:** `sportsshoes` / `ss`

## Regions

`country_code`: `GB`, `DE`, `FR`, `IT`, `ES`, …

## Sample CSVs

<div class="download-box">

- 📄 [sportsshoes-buy.csv](/samples/sportsshoes-buy.csv)
- 📄 [sportsshoes-register.csv](/samples/sportsshoes-register.csv)

</div>

## Buy row

```csv
ss;https://www.sportsshoes.com/product/xxx;buy;1;200;3;you@mail.com;P4ss;42,43;GB
```

URL can also be a keyword or SKU — the bot falls back to a Bloomreach search and takes the first match.

## Register row

```csv
ss;;register;1;0;0;new@mail.com;NewP4ss;John;Smith;Baker Street;221;NW16XE;London;GB;+441234567890
```

## Known issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Captcha failed` | reCAPTCHA score too low | Residential proxy |
| `no shipping options` | Item doesn't ship to `country_code` | Change country or skip |
| `3DS required` | Payment challenge | Complete 3DS on your phone; order stays pending until you do |
