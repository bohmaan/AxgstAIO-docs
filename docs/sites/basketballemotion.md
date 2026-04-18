# BasketballEmotion

Spanish basketball apparel site on the Empathy commerce platform. No captcha, no heavy anti-bot.

## CSV code

`basketballemotion` or `be`

## Regions

Uses the market segment in the URL path (`/es/`, `/fr/`, ...). Falls back to `/eu/`.

## Search mode (buy)

Short URL field = SKU keyword, passed to Empathy search.

```csv
be;BASKET-SKU-123;buy;1;80;2;c@c.es;pwd;L;ES;
```

## Buy flow

1. Login via BESESSID cookie.
2. Clear cart.
3. Fetch product by URL or search by SKU.
4. Add to cart (HTTP form).
5. 3-step checkout: billing → shipping → payment.
6. PayPal URL returned.

## Register

POST to `/register` with email, password, accept-TOS. Address added via a separate checkout-address API call.

## Known issues

- **`Address not found — creating...`** — account has no saved address. Bot adds it via the checkout flow.
- **`Waiting for restock`** — no `sizes` available. Update the CSV or wait.

## Address fix mode

A rare `addressfix` mode exists to repair accounts where the default address was misconfigured. Set `mode=addressfix` in CSV.
