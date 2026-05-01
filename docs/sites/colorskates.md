# Colorskates

**Codes:** `colorskates` / `cs`

Greek skate shop ([colorskates.com](https://www.colorskates.com/)). Buy + register modes. Login is required for buy — Colorskates doesn't expose guest checkout.

## Sample CSVs

<div class="download-box">

- 📄 [colorskates-buy.csv](/samples/colorskates-buy.csv)
- 📄 [colorskates-register.csv](/samples/colorskates-register.csv)

</div>

## Buy row

```csv
cs;https://www.colorskates.com/product/<id>/<slug>.html;buy;1;200;3;you@mail.com;YourPassword;42;GR
```

The bot logs in (or restores a cached session), watches the product page, ATCs as soon as your size is in stock, and runs the standard checkout (shipping → payment → confirm). On success the order URL is sent to your webhook; if the payment step needs a hosted page (PayPal / Viva), the bot forwards that link instead.

If the auto-checkout can't finalise (unusual shipping/payment combination, or the cart was held for review), the bot still ATCs and posts the cart URL to the webhook so you can finish manually in a browser — the account is logged in via the same session, so opening the link works straight away.

## Register row

```csv
cs;;register;1;0;0;new@mail.com;NewP4ss;Test;User;Solonos;1;10672;Athens;GR;+302100000000
```

Address from the CSV is saved during register so the next `buy` task on the same account skips the address step at checkout.

::: tip CapSolver required
Register **and buy** are gated by reCAPTCHA v2 — set `CAPSOLVER_KEY` in `config.ini` before running them. Only login is uncaptcha'd.
:::

## Presolve mode

Run `mode=presolve` in parallel with your buy tasks to keep a small bank of payment-page captcha tokens ready. The buy task then grabs a fresh token instantly instead of waiting ~10–30s for CapSolver to solve a new one — useful on hyped drops where every second matters.

```csv
cs;;presolve;1;0;0;you@mail.com;YourPassword;;GR
```

Bank size comes from `captcha_bank_size` in `config.ini` (default `2`). Tokens have a ~2 minute server lifetime; the presolve loop refills the bank automatically.

## Region

Greek-first storefront. The bot maps the CSV `country_code` to Hypercenter's numeric country IDs — most EU countries plus US/UK are mapped (`GR`, `CY`, `CZ`, `SK`, `DE`, `AT`, `IT`, `FR`, `ES`, `NL`, `BE`, `GB`, `US`, `PL`, `HU`, `RO`, `BG`, `CH`, `SE`, `DK`, `FI`, `IE`, `PT`, …).

## Sizes

The CSV `sizes` column accepts a single EU value (`42`, `9.5`) or a comma-separated list (`42,42.5,43`). First match in stock wins. Stock is read live from the size grid on the product page.

## Notes

- Login session is cached for ~12h — repeated buys on the same account skip the login step.
- Cloudflare is the only bot wall and the bot's standard `curl_cffi` Chrome impersonation passes the basic challenge. If you ever see a managed-challenge HTML response, run from a residential IP.
- Payment options expose what Colorskates currently offers — typically bank transfer / PayPal / Viva Wallet. The bot picks the first available payment method by default.
