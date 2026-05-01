# BasketballEmotion

**Codes:** `basketballemotion` · `be`

## Region

Set the country segment with `country_code` (`ES`, `FR`, `IT`, `DE`, …). Falls back to `EU`.

## Sample CSVs

<div class="download-box">

- 📄 [basketballemotion-buy.csv](/samples/basketballemotion-buy.csv)
- 📄 [basketballemotion-register.csv](/samples/basketballemotion-register.csv)

</div>

## Modes

### `buy`

```csv
be;https://www.basketballemotion.com/es/product-slug;buy;1;80;2;you@mail.com;P4ss;L;ES
```

Column 2 also accepts a SKU or keyword — the bot will search and take the first match. The `sizes` column accepts a single value (`L`, `42`, `9.5`) or a comma-separated list (first match in stock wins).

### `register`

```csv
be;;register;1;0;0;new@mail.com;NewP4ss;Juan;Perez;Calle Gran Via;1;28013;Madrid;ES;+34612345678
```

### `addressfix`

Repairs accounts whose default address didn't stick from a prior register. Use the same row layout as `register` but set mode = `addressfix`.

## Known issues

| Error | Cause |
|-------|-------|
| `Address not found — creating...` | Account has no saved address; bot adds it from the CSV |
| `Waiting for restock` | None of your sizes are in stock — bot retries every `delay` seconds |
