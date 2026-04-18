# FutbolEmotion

**Code:** `futbolemotion` / `fe`

Sister site of [BasketballEmotion](/sites/basketballemotion) — same Empathy platform, identical flow.

## Regions

Market segment in the URL path (`/es/`, `/fr/`, `/it/`, …). Falls back to `/eu/`.

## Sample CSVs

<div class="download-box">

- 📄 [futbolemotion-buy.csv](/samples/futbolemotion-buy.csv)
- 📄 [futbolemotion-register.csv](/samples/futbolemotion-register.csv)

</div>

## Buy row

```csv
fe;https://www.futbolemotion.com/es/boots-nike-mercurial;buy;1;150;3;you@mail.com;P4ss;42;ES
```

URL can be a SKU — the bot runs an Empathy search.

## Register row

```csv
fe;;register;1;0;0;new@mail.com;NewP4ss;Juan;Perez;Calle Gran Via;1;28013;Madrid;ES;+34612345678
```
