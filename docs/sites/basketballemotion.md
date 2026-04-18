# BasketballEmotion

**Code:** `basketballemotion` / `be`

## Regions

Market segment in the URL path (`/es/`, `/fr/`, …). Falls back to `/eu/`.

## Sample CSVs

<div class="download-box">

- 📄 [basketballemotion-buy.csv](/samples/basketballemotion-buy.csv)
- 📄 [basketballemotion-register.csv](/samples/basketballemotion-register.csv)

</div>

## Buy row

```csv
be;https://www.basketballemotion.com/es/product-slug;buy;1;80;2;you@mail.com;P4ss;L;ES
```

URL can be a SKU — the bot runs an Empathy search.

## Register row

```csv
be;;register;1;0;0;new@mail.com;NewP4ss;Juan;Perez;Calle Gran Via;1;28013;Madrid;ES;+34612345678
```

## Known issues

| Error | Cause |
|-------|-------|
| `Address not found — creating...` | Account has no saved address; bot adds it automatically |
| `Waiting for restock` | No preferred size available |

## Address fix

A rare `mode=addressfix` exists to repair accounts with a misconfigured default address.
