# Sportvision

Balkan sporting goods retailer. Operates in RS (Serbia) and HR (Croatia).

## CSV code

`sportvision` or `sv`

## Regions

`RS` (dinar) and `HR` (euro). Set via `country_code`.

## Buy flow

1. Login (session cookie).
2. Product fetch via `/p/<product_slug>`.
3. Size selection.
4. ATC.
5. Checkout with address + payment.
6. Confirmation URL.

## Known issues

- Dinar-only payment methods are not supported. Only cards and PayPal where available.
- Stock levels on sportvision.rs are sometimes wrong — item may show available then fail at ATC.

## Recommended CSV row

```csv
sv;https://www.sportvision.rs/p/jordan-1-low;buy;1;15000;3;a@a.com;pwd;42;RS;<webhook>
```
