# Pagro

**Codes:** `pagro` / `pg`

Austria. Ships AT primary. Currency EUR.

## Sample CSVs

<div class="download-box">

- 📄 [pagro-buy.csv](/samples/pagro-buy.csv)
- 📄 [pagro-register.csv](/samples/pagro-register.csv)

</div>

## Buy row

```csv
pg;https://www.pagro.at/<product-slug>.html;buy;1;100;3;you@mail.at;YourPassword;AT
```

The bot logs in, ATCs, and runs checkout. The card payment itself happens on **Saferpay's hosted page** — the bot posts that URL to your webhook, you open it in a real browser and fill in the card details.

If the item is out of stock the bot keeps retrying at the CSV `delay` interval until it's back.

Login session is cached for ~6h — subsequent buys on the same account skip both the Cloudflare check and login.

## Register row

```csv
pg;;register;1;0;0;new@mail.at;NewP4ss;AT;Hans;Mueller
```

No captcha at signup. Add the delivery address later through your Pagro account before running buy tasks.

## Cloudflare

Pagro is protected by **Cloudflare Turnstile**. The bot solves it automatically, but it does need a display to click the checkbox.

::: tip Headless setup
On a headless Linux server, run the launcher under a virtual display:

```bash
xvfb-run -a ./axgstaio
```

On Windows / macOS desktops it works out of the box.
:::

If you run a large fleet of tasks at once, the bot caps simultaneous Cloudflare solves to 5 — extra tasks wait their turn instead of failing.

## Known issues

- No size/option support — Pagro products are single-SKU only.
- Card payment is always finalised on Saferpay's hosted page; there's no way to fully automate the card step.
