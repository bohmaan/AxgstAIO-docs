# Elbenwald

German fantasy / gaming merch retailer (Marvel, Star Wars, LOTR). Shopware-based backend.

## CSV code

`elbenwald` or `ew`

## Regions

Primarily Germany. Ships across the EU.

## Buy flow

1. Login (Shopware account).
2. Fetch product (JSON via `/detail/index/sArticle/...`).
3. Add to cart.
4. Checkout: address → shipping → payment.
5. PayPal URL.

## Known issues

- **Limited-edition drops** sometimes put items behind a waiting-list / queue. Bot can't bypass those.
- **Shipping options** default to DHL; change via CSV `country_code` if needed.

## Recommended CSV row

```csv
ew;https://www.elbenwald.de/Kategorien/Produkt-Spezial/Herr-der-Ringe-Aragorn-T-Shirt;buy;1;60;3;a@a.de;pwd;L;DE;<webhook>
```
