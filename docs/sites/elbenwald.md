# Elbenwald

**Code:** `elbenwald` / `ew`

## Region

Germany primary. Ships EU-wide.

## Sample CSVs

<div class="download-box">

- 📄 [elbenwald-buy.csv](/samples/elbenwald-buy.csv)
- 📄 [elbenwald-register.csv](/samples/elbenwald-register.csv)

</div>

## Buy row

```csv
ew;https://www.elbenwald.de/product-slug;buy;1;60;3;you@mail.de;P4ss;L;DE
```

## Register row

```csv
ew;;register;1;0;0;new@mail.de;NewP4ss;;DE;Hans;Mueller;Hauptstrasse;12;10115;Berlin;+4915112345678
```

Pure HTTP register — no browser, no Selenium. The form's hidden reCAPTCHA v3 field is solved via CapSolver (`CAPSOLVER_KEY` from `config.ini`).

::: tip Country support
Currently mapped: DE / AT / CH / BE / BG / DK / EE / FI / FR / AU. For other countries the bot falls back to DE.
:::

## Known issues

- Limited-edition drops may be behind a waiting-list / queue — the bot can't bypass those.
- Default shipping is DHL; override via `country_code`.
- `Register failed — reCAPTCHA score too low`: CapSolver gave a token below 0.7. Retry the task.
