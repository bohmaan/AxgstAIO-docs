# Mycomics

European comics marketplace. Lightweight catalog, no captcha.

## CSV code

`mycomics` or `mc`

## Regions

Ships EU-wide.

## Buy flow

1. Login via session cookie.
2. Fetch product (HTML page parse).
3. Add to cart.
4. Checkout: shipping address + payment.
5. PayPal URL.

## Recommended CSV row

```csv
mc;https://www.mycomics.com/en/product/xxx;buy;1;100;3;a@a.com;pwd;;EU;<webhook>
```

## Known issues

- **Rare items** go out of stock between probe and ATC — no inventory reservation.
