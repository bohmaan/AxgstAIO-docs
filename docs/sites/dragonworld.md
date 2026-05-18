---
# Unlisted on purpose — low-volume target, not in the Sites overview/nav.
aside: false
---

# Dragon World

**Code:** `dragonworld` (aliases `dw`, `dragon-world`)
**Region:** CZ
**Modes:** `buy`
**Payment:** GP Webpay — card link sent to your webhook
**Notes:** Guest checkout, no account. Low-key target.

`dragon-world.store` is a WooCommerce shop. Pure-HTTP Store API
checkout: cart → address → PPL home delivery → order. GP Webpay is the
card gateway — the bot creates the order and forwards the **GP Webpay
3-D Secure pay link** (`3dsecure.gpwebpay.com/pgw/card?...`) to your
webhook. The bot never touches the card form; you finish payment from
the link.

## CSV row

```csv
dragonworld;https://dragon-world.store/produkt/example/;buy;1;;2000;3;you@example.com;;;Jan;Novak;+420777888999;Konevova;135;Praha;13000;;CZ;;;
```

- Product URL is the `/produkt/<slug>/` PDP.
- Shipping defaults to **PPL home delivery**. Override via the
  shipping column with `toret_ppl_point`, `dpd_pickup` or
  `local_pickup:2` if needed.
- Payment defaults to `gpwebpay`. `pnu` (bank transfer) is the only
  other option.

## Sample CSV

- [dragonworld-buy.csv](/samples/dragonworld-buy.csv)
