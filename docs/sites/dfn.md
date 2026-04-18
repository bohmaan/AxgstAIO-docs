# Dfn (Def-Shop)

German streetwear retailer. EUR pricing default. No captcha on buy.

## CSV code

`dfn`

## Regions

Ships EU-wide. Currency EUR.

## Buy flow

1. Login.
2. Product fetch via JSON API.
3. Size selection.
4. ATC.
5. Checkout: address + shipping + PayPal.

## Known issues

- Some drops are region-locked to DE. Task returns `shipping not available` if ordering from outside.
- Sale items are excluded from PayPal; bot falls back to card-only (not supported — task fails).

## Recommended CSV row

```csv
dfn;https://www.defshop.com/product/xxx;buy;1;200;3;a@a.de;pwd;L;DE;<webhook>
```
