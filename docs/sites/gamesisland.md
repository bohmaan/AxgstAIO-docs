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

Register POSTs the JTL-Shop registration form with the full delivery address so it's saved as the default billing + shipping address in one shot — no separate "add address" step needed.

::: tip reCAPTCHA
The register form is gated by **reCAPTCHA v2 (checkbox)**. The module solves it automatically via CapSolver using the `CAPSOLVER_KEY` from `config.ini`.
:::

## Checkout

- Shipping: whichever default method the shop offers for your delivery country
- Payment: **Vorkasse / Bank Transfer (Überweisung)** — the module places the order and you pay via bank transfer using the details in the confirmation email. No 3DS / card auth needed.
- The module picks the payment option whose label matches `vorkasse` / `überweisung` / `bank transfer` / `banküberweisung`.

## Monitor + price check

```csv
gi;https://games-island.eu/slug;buy;1;50;3;...
```

- Column 5 (`max_price`) caps the buy price. Set to `0` to buy regardless.
- Column 6 (`delay`) is the seconds between monitor re-checks.
- While waiting, the module prints `Monitoring — <name> | <price> EUR (limit: 50.00)` each tick and buys as soon as price ≤ limit.
- On soft-404 (product temporarily delisted) the module auto-retries with the CSV delay.

## ATC retry (OOS / insufficient quantity)

If the shop returns `Die gewünschte Menge dieses Produkts ist nicht verfügbar` or similar, the module retries ATC with the CSV `delay` between attempts. Re-fetches the product page each retry to refresh the CSRF token.

## Known issues

| Error | Cause |
|-------|-------|
| `Register failed — password too weak` | Password doesn't meet JTL's policy; mix upper/lower/digit/symbol |
| `Login failed — credentials` | Wrong email/password |
| `No article_id on page — check URL` | URL isn't a valid games-island product page |
| `No Vorkasse/Bank-Transfer method found` | Shop didn't offer bank transfer for your delivery country — pick a PL/DE address |
| `ATC refused — ... Menge ...` | Out of stock — module auto-retries with CSV delay |
| `reCAPTCHA solve failed` | CapSolver quota / wrong key — check `config.ini` |

## Anti-bot notes

games-island.eu fronts protected routes (category, product, cart, checkout) with **in-Reach CBF**, a WebAssembly proof-of-work challenge served from `cap.games-island.eu` (CapJS-compatible).

The module solves the PoW in **pure Python** (FNV-1a + xorshift32 + SHA-256), typically ~0.15–0.3 s, then POSTs `/cb/cfb.php/cfbvalidate` to establish the `cfbtoken` cookie. After that, all subsequent requests in the session work without re-solving — the challenge fires only once per session start.

No browser / WASM runtime needed — it's all HTTP.
