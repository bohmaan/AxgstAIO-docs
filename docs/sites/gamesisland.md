# Games Island

**Code:** `gamesisland` / `gi`

## Region

Germany + EU. Currency EUR. Site: [games-island.eu](https://games-island.eu/).

JTL-Shop 5 store specialising in TCG / tabletop / board games (MtG, Pokémon, Yu-Gi-Oh, Games Workshop, Marvel Crisis Protocol, etc.).

## Sample CSVs

<div class="download-box">

- 📄 [gamesisland-buy.csv](/samples/gamesisland-buy.csv)
- 📄 [gamesisland-register.csv](/samples/gamesisland-register.csv)

</div>

## Buy row

```csv
gi;https://games-island.eu/Marvel-Crisis-Protocol-Adam-Warlock-Moondragon;buy;1;50;3;you@mail.de;P4ss1234!;;DE
```

The URL is the product page — any `games-island.eu/<slug>` works. The article ID is parsed from the inline `buy_form_<id>` form.

## Register row

```csv
gi;;register;1;0;0;new@mail.de;NewP4ss1234!;;DE;Max;Mustermann;Musterstrasse;12;10115;Berlin;+4915112345678
```

::: tip reCAPTCHA
The register form is gated by **reCAPTCHA v2 (checkbox)**, solved automatically via CapSolver using `CAPSOLVER_KEY` from `config.ini`.
:::

## Checkout

- Shipping: default method offered by the shop for your delivery country
- Payment: **Vorkasse / Bank Transfer (Überweisung)** — order is placed, pay via bank transfer using the details in the confirmation email. No 3DS / card auth needed.

## Monitor + price check

- Column 5 (`max_price`) caps the buy price. Set `0` to buy regardless.
- Column 6 (`delay`) is the seconds between monitor re-checks.
- The module prints the live price each tick and buys as soon as price ≤ limit. On OOS / soft-404 it auto-retries with the CSV delay.

## Known issues

| Error | Cause |
|-------|-------|
| `Register failed — password too weak` | Password doesn't meet JTL's policy; mix upper/lower/digit/symbol |
| `Login failed — credentials` | Wrong email/password |
| `No article_id on page — check URL` | URL isn't a valid games-island product page |
| `No Vorkasse/Bank-Transfer method found` | Shop didn't offer bank transfer for your delivery country — pick a PL/DE address |
| `ATC refused — ... Menge ...` | Out of stock — module auto-retries with CSV delay |
| `reCAPTCHA solve failed` | CapSolver quota / wrong key — check `config.ini` |
