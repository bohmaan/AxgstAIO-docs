# Mueller

**Code:** `mueller` / `ml`

## Region

Germany only. Currency EUR.

## Sample CSVs

<div class="download-box">

- 📄 [mueller-buy.csv](/samples/mueller-buy.csv)
- 📄 [mueller-register.csv](/samples/mueller-register.csv)

</div>

## Buy row

```csv
ml;https://www.mueller.de/p/slug-PPN3163472/;buy;1;100;3;you@mail.de;P4ss1234!;;DE
```

The product URL must contain the article code suffix: either `...-PPN<digits>/` (main catalogue) or `...-IPN<digits>/` (partner items). The module extracts the trailing numeric code.

## Register row

```csv
ml;;register;1;0;0;new@mail.de;NewP4ss1234!;;DE;Hans;Mueller;Musterstrasse;12;10115;Berlin;+4915112345678
```

::: tip Password policy
Mueller requires **8+ chars with upper + lower + digit + symbol**. Weak passwords fail with `PWD_TOO_WEAK`.
:::

## Checkout

- Shipping: home delivery (only mode currently supported)
- Payment: **PayPal** — module returns a `paypal.com/checkoutnow?token=...` URL on the webhook, open it to authorise.

## Loop mode

`mode=loop` places one order, then immediately starts another (ATC → checkout → place order), repeating until you stop the task. Login happens once at start; each iteration prints a fresh PayPal URL.

```csv
ml;https://www.mueller.de/p/slug-PPN3163472/;loop;1;100;3;you@mail.de;P4ss1234!;;DE
```

## Known issues

| Error | Cause |
|-------|-------|
| `Register failed — password too weak...` | Password doesn't meet 8+ char upper+lower+digit+symbol policy |
| `Login failed — credentials` | Wrong email/password, or account not verified yet |
| `Bad URL — no product code` | URL missing `PPN<digits>/` or `IPN<digits>/` suffix |
| `Out of stock — retry in Xs` | ATC returned no entry for the product — module auto-retries |
| `Order failed — no PayPal URL` | Address or stock validation error |
