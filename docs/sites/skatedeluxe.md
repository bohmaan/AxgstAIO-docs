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

Pays via Stripe in-line — no extra browser step. Card brand is auto-detected; `card_number` / `card_exp` / `card_cvv` columns are required. Works for any country where skatedeluxe ships and offers card payment.

### `bank` — bank transfer (Vorkasse)

```csv
sd;<pdp-url>;bank;1;100;3;you@mail.de;YourPassword;;DE
```

Selects `moneyorder` payment. **Only available for DE addresses** — skatedeluxe doesn't offer bank transfer for other countries. No card data needed; you wire the money manually after the order is placed.

### `register` — create account + save default address

```csv
sd;;register;1;0;0;new@mail.de;NewP4ss;DE;Hans;Mueller;Hauptstrasse;1;10115;Berlin;+4915112345678;1990-06-15
```

The bot creates the account, then saves the CSV address as the customer's **default** in one go — so any later `buy` / `bank` run on the same account goes straight to checkout without re-entering the address. Register requires an invisible reCAPTCHA solve (CapSolver key in `config.ini`).

## Notes

- Login is cached for ~24h — second buy on the same account skips the login step.
- Captcha is only needed for register. Buy and bank-transfer runs don't touch CapSolver.

## Known issues

- Skateboard decks are bundled with grip tape on ATC — both items appear as one line in the cart
- DE bank transfer: only available for DE billing addresses; the bot will fail with "Bank transfer unavailable" if you try it from a non-DE address
