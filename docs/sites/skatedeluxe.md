# Skatedeluxe

**Code:** `skatedeluxe` / `sd`

## Region

DE primary, ships across EU.

## Sample CSVs

<div class="download-box">

- 📄 [skatedeluxe-buy.csv](/samples/skatedeluxe-buy.csv) — credit-card checkout
- 📄 [skatedeluxe-bank.csv](/samples/skatedeluxe-bank.csv) — bank transfer (DE only)
- 📄 [skatedeluxe-register.csv](/samples/skatedeluxe-register.csv)

</div>

## Modes

### `buy` — credit-card checkout

```csv
sd;<pdp-url>;buy;1;100;3;you@mail.com;YourPassword;;CZ;4242424242424242;12/27;123
```

Uses Stripe `payment_methods` API directly with the merchant's publishable key (no Stripe.js, pure HTTP). Card brand is auto-detected; `card_number`/`card_exp`/`card_cvv` columns required. Works for any country where Stripe is offered.

### `bank` — bank transfer (Vorkasse)

```csv
sd;<pdp-url>;bank;1;100;3;you@mail.de;YourPassword;;DE
```

Selects `moneyorder` payment. **Only available for DE addresses** — skatedeluxe doesn't offer bank transfer for other countries. No card data needed; you wire the money manually after the order is placed.

### `register` — create account + save default address

```csv
sd;;register;1;0;0;new@mail.de;NewP4ss;DE;Hans;Mueller;Hauptstrasse;1;10115;Berlin;+4915112345678;1990-06-15
```

Pure JSON register via `/api2/auth` (Cloudflare Turnstile solved with CapSolver). Right after the account is created the bot saves the address from the CSV as the customer's **default**, so subsequent `buy` / `bank` runs go straight to checkout — no per-purchase address re-entry.

## Performance

- Single small HTML scrape per session to grab the CSRF token — everything else is JSON
- Persistent login session (24h TTL) in `~/.axgst/sessions/sd_<hash>.json`
- 200KB Range header on the PDP fetch to avoid downloading full 1MB+ pages
- Stripe tokenization is direct HTTP to `api.stripe.com/v1/payment_methods` — no Stripe.js iframe

## Anti-bot

None observed for login/buy. Cloudflare Turnstile only on registration.

## Known issues

- Skateboard decks are bundled with grip tape on ATC — both items appear as one line in the cart
- DE bank transfer: only available for DE billing addresses; the bot will fail with "Bank transfer unavailable" if you try it from a non-DE address
