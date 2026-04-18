# SportsShoes

UK retailer with reCAPTCHA v3 on login and checkout. AxgstAIO solves the captcha automatically via an embedded service key.

## CSV code

`sportsshoes` or `ss`

## Regions

Supports any region the site ships to. Use `country_code` column (`GB`, `DE`, `FR`, `IT`, `ES`, ...).

## Buy flow

1. **Login** — email/password + reCAPTCHA v3 token.
2. **Product lookup** — HTML page parse for name, image, price, sizes.
3. **Size selection** — matches `sizes` against EU sizing labels.
4. **Add to cart** — HTTP POST.
5. **Checkout init** — GET `/checkout/`.
6. **Billing + shipping** — POST forms with account default address or CSV fields.
7. **Payment** — Adyen / PayPal redirect captured and returned.

## Search mode (buy)

If `url` is not a full URL (e.g. `M1234-A`), the bot does a Bloomreach keyword search and uses the first match.

```csv
ss;M1234-A;buy;1;200;3;a@a.com;pwd;42,43;GB;
```

## Register

Creates account → submits billing/shipping → optional 3DS challenge captured via webhook.

## Known issues

- **`Captcha failed`** — reCAPTCHA score too low. Retry with a different proxy (residential recommended).
- **`Checkout failed — no shipping options`** — the site doesn't ship your `country_code` for this item. Switch country or skip.
- **3DS required** — the bot prints the 3DS URL; complete it on your phone. The order sits in a pending state until you do.

## Recommended CSV row

```csv
ss;https://www.sportsshoes.com/product/asi9130/asics-gel-contend-9/;buy;1;80;3;you@email.com;P4ss;42,43;GB;<webhook>
```
