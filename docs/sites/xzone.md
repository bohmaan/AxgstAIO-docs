# Xzone

**Code:** `xzone` (aliases `xz`, `xzone.cz`, `xzone.pl`, `xzone.de`, `xzone.sk`)
**Region:** CZ / PL / DE / SK
**Modes:** `buy`
**Payment:** Online card → hosted-gateway pay link sent to your webhook
**Notes:** Guest checkout, no account, no captcha. One module, four localized domains.

`xzone.cz/.pl/.de/.sk` is one custom PHP shop on four domains (games,
TCG, board games, merch). Pure-HTTP, guest-only. The bot adds to cart,
fills the address, places the order, and **forwards the hosted payment
link to your webhook** — it never touches the card form / 3DS.

## Domain — pick via the `site` column

| `site` value | Store | Currency |
|---|---|---|
| `xzone` / `xzone.cz` / `xz` | xzone.cz | CZK |
| `xzone.pl` | xzone.pl | PLN |
| `xzone.de` | xzone.de | EUR |
| `xzone.sk` | xzone.sk | EUR |

## Payment gateway

The gateway is chosen **server-side per domain** — the bot does not
hardcode or care which one. It follows the order's redirect chain and
forwards whatever hosted payment page it lands on:

- **xzone.cz** → ČSOB (`platebnibrana.csob.cz/pay/xzone.cz/<uuid>/`)
- **xzone.pl / .de / .sk** → the local gateway for that store (GoPay
  `gate.gopay.com/gw-ui/rest/v3/<id>/start-method`, GP webpay, P24…)

You receive that link in the success webhook (label **Card online**).
Open it to complete payment. COD / store-pickup / preorder create the
order with no online-pay link (still a success webhook, no `pay_url`).

## CSV row

```csv
xzone.cz;https://www.xzone.cz/example-product;buy;1;;3000;3;you@example.com;;;Jan;Novak;+420777123456;Václavské náměstí;1;Praha;11000;;CZ;;;
```

```csv
xzone.pl;https://www.xzone.pl/example-product;buy;1;;3000;3;you@example.com;;;Jan;Kowalski;+48600000000;Marszałkowska;1;Warszawa;00-001;;PL;;;
```

- `url` is the product page (the flat `/<slug>` PDP).
- Address fields **first_name / last_name / street / city / postal_code
  / email / phone are required** — xzone rejects checkout if any is
  blank (a thin row falls back to a generic in-country address, but
  identity must come from the task).
- `country_code` defaults from the domain (CZ/PL/DE/SK); set it to ship
  cross-border.

## Optional columns

| Column | Effect |
|---|---|
| `shipping_method` | `nTransportID` override (ids differ per domain — leave empty to use the store default; set it to pin a courier). |
| `payment_method` | `nPaymentID` override. Empty = online card / server default. |

## Sample CSV

- [xzone-buy.csv](/samples/xzone-buy.csv)

## Modes

- `buy` — resolve product → ATC → shipping + payment → guest address →
  place order → forward the hosted payment link to the webhook.
