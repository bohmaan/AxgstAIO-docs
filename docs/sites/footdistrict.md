# FootDistrict

Spanish sneaker boutique. Shopify-based. No aggressive bot-detection but uses reCAPTCHA on account creation.

## CSV code

`footdistrict` or `fd`

## Regions

Ships across EU + UK. Currency EUR default.

## Buy flow

1. Login (customer token).
2. Product fetch via Shopify `/products/<handle>.js`.
3. Select variant by EU size.
4. Add to cart (Shopify `/cart/add.js`).
5. Checkout → shipping → payment.
6. PayPal URL or Adyen redirect.

## Register

reCAPTCHA v3 required. Solved via embedded service key.

## Known issues

- **Region restriction** — some raffle sneakers are EU-only or ES-only. Task fails at checkout with `shipping not available`.
- **Stock reservations** — item in cart does not reserve inventory. If it's a hype drop, race to checkout is real; the bot is fast enough for most drops but not instant.

## Recommended CSV row

```csv
fd;https://footdistrict.com/en/products/new-balance-2002r;buy;1;200;3;a@a.es;pwd;42,43;ES;<webhook>
```
