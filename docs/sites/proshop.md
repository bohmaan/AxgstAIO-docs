# Proshop

**Code:** `proshop` / `ps` / `proshop.de` / `proshop.at` / `proshop.pl` / `proshop.nl`

## Region

Germany, Austria, Poland, Netherlands. The TLD is auto-detected from the product URL (e.g. `https://www.proshop.nl/...`) or you can set the site code explicitly to `proshop.nl` etc. Login uses the matching IdentityServer4 IdP at `auth.proshop.<tld>`.

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

Fresh login, ATC by product id, then a 5-request linear walk:

1. `POST /Basket/CheckOut/Terms/SetAcceptedTraidConditions`
2. `GET  /Basket/CheckOut/Delivery` — scrapes the per-TLD `deliveryOption` radio + CSRF
3. `POST /Basket/CheckOut/Delivery/SetDeliveryOption` — DPD private home by default
4. `GET  /Basket/CheckOut/Payment` — scrapes the rotating PayPal button GUID
5. `POST /Basket/CheckOut/Payment/SetPaymentOption` → returns `paypal.com/pay?token=EC-…`

The PayPal handoff URL is sent to the webhook as `pay_url`; open it in a browser and confirm payment.

## Pickup mode (DPD pickup shop)

Set the **sizes** column to `pickup` and provide **postal_code** in the same row. The bot fetches the nearest DPD pickup point via `/Basket/CheckOut/Delivery/GetServicePointsPartialView?id=DPD&zipCode=<zip>` and picks the first (nearest) result.

```csv
ps;https://www.proshop.de/Brand/Slug/3302841;buy;1;200;3;you@mail.de;P4ss;pickup;DE;;;;;10115
```

The `postal_code` field is the 14th column (after country_code/first_name/last_name/street/building_number/zip…). For pickup mode only `postal_code` is read — the rest of the address comes from the saved customer profile.

## Keyword monitoring

Instead of a product URL, put a **keyword** in the URL column. The bot polls `/Search?type=Product&q=<keyword>` until a matching product appears, then proceeds with the first hit.

```csv
ps;lego star wars u-wing;buy;1;200;3;you@mail.de;P4ss;;DE
```

A keyword is detected when the URL column has no scheme (`http://`/`https://`) and no slash. Matching is whatever proshop's search ranks first for that query.

## Register row

```csv
ps;;register;1;0;0;new@mail.de;NewP4ss;;DE;Hans;Mueller;Hauptstrasse;12;10115;Berlin;+4915112345678
```

`register` mode creates the account on `auth.proshop.<tld>`, logs in, then writes the address to the customer profile via `/CustomerCenter/CustomerAccount/PartialRegister`. After register, the account is immediately ready for `buy`.

## Addy-fix row

```csv
ps;;addy_fix;1;0;0;you@mail.de;P4ss;;DE;Hans;Mueller;Hauptstrasse;12;10115;Berlin;+4915112345678
```

For accounts that exist but have no saved shipping address. Logs in and posts the address form once. Required before `buy` will work — without a saved address the checkout flow lands on Step 1 (Meine Informationen) and the buy walker bails.

## Requirements

- **Saved address on the account.** Buy mode assumes Register/Terms is skipped server-side. Run `addy_fix` once per account if needed.
- **PayPal as payment.** Other methods (Visa/MC/Apple/Google Pay/Klarna/SEPA) are not implemented — the walker only picks the PayPal button.
- **Default delivery: DPD private home.** Use `pickup` size to switch to DPD pickup shop.
- **Pickup needs postal_code.** Required because the service-points endpoint sorts by zip.

## Known issues

- **Cloudflare TLS fingerprinting** — modern Chrome impersonations (chrome131/120/124) get 403 on `auth.proshop.<tld>`. The bot pins `chrome116` which CF still accepts.
- **No guest checkout** — every task must include `email` + `password`.
- **No session caching** — login runs on every task. Slightly slower, but avoids stale-cookie checkout bounces.
- **PayPal cart hold is not guaranteed.** Stock is validated when PayPal returns to proshop, not when you receive the handoff URL — for hyped drops, finish PayPal payment immediately.
