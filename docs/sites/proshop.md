# Proshop

**Code:** `proshop` / `ps` / `proshop.de` / `proshop.at` / `proshop.pl` / `proshop.nl`

## Region

Germany, Austria, Poland, Netherlands. The TLD is auto-detected from the
product URL (e.g. `https://www.proshop.nl/...`) or you can set the site
code explicitly to `proshop.nl` etc.

## Sample CSVs

<div class="download-box">

- 📄 [proshop-buy.csv](/samples/proshop-buy.csv)
- 📄 [proshop-register.csv](/samples/proshop-register.csv)
- 📄 [proshop-addy-fix.csv](/samples/proshop-addy-fix.csv)

</div>

## Buy row

```csv
ps;https://www.proshop.de/Brand/Slug/3302841;buy;1;200;3;you@mail.de;P4ss;;DE
```

Fresh login, ATC by product id, drives the checkout and webhooks the
PayPal handoff URL. Open it in a browser and confirm payment.

## Pickup mode (DPD pickup shop)

Set the **sizes** column to `pickup` and provide **postal_code** in the
same row. The bot picks the nearest DPD pickup point to that zip.

```csv
ps;https://www.proshop.de/Brand/Slug/3302841;buy;1;200;3;you@mail.de;P4ss;pickup;DE;;;;;10115
```

The `postal_code` field is the 14th column. For pickup mode only
`postal_code` is read — the rest of the address comes from the saved
customer profile.

## Keyword monitoring

Instead of a product URL, put a **keyword** in the URL column. The bot
polls Proshop search until a matching product appears, then proceeds with
the first hit.

```csv
ps;lego star wars u-wing;buy;1;200;3;you@mail.de;P4ss;;DE
```

A keyword is detected when the URL column has no scheme (`http://` /
`https://`) and no slash.

## Register row

```csv
ps;;register;1;0;0;new@mail.de;NewP4ss;;DE;Hans;Mueller;Hauptstrasse;12;10115;Berlin;+4915112345678
```

Creates the account, logs in, writes the shipping address to the customer
profile. After register the account is immediately ready for `buy`.

## Addy-fix row

```csv
ps;;addy_fix;1;0;0;you@mail.de;P4ss;;DE;Hans;Mueller;Hauptstrasse;12;10115;Berlin;+4915112345678
```

For accounts that already exist but have no saved shipping address. Logs
in and posts the address form once. Required before `buy` will work
without bouncing back to the customer-info step.

## Requirements

- **Saved address on the account.** Run `addy_fix` once per account if you
  registered it outside the bot.
- **PayPal as payment.** Other methods (Visa, Mastercard, Apple/Google
  Pay, Klarna, SEPA) are not supported.
- **Default delivery: DPD home.** Use `pickup` to switch to DPD pickup
  shop nearest to your zip.

## Known limitations

- **PayPal cart hold is not guaranteed.** Stock is checked when PayPal
  returns to Proshop, not when you receive the handoff URL — for hyped
  drops, finish payment immediately.
- **No guest checkout.** Every task must include `email` + `password`.
