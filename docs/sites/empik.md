# Empik

Polish media + books marketplace. Simple session-based auth, PayU + Blik + Przelewy24 payments.

## CSV code

`empik` (default — if `site` column is empty, Empik is assumed)

## Regions

Poland only.

## Buy flow

1. Login via session cookie.
2. Fetch product detail (name, price, availability).
3. Add to cart (HTTP form).
4. Checkout: address + shipping + payment selection.
5. PayPal URL (or Blik challenge).

## Common URL patterns

- Book: `https://www.empik.com/<title-slug>,p<product_id>,<format>`
- Music: `https://www.empik.com/<title-slug>,p<product_id>,cd-p` / `,<format>-p`
- Other: similar slug + id pattern.

## Known issues

- **`Checkout failed — product page error`** — URL malformed or product discontinued.
- **`Waiting for restock`** — book out of stock; edition may still be in print, check delivery date.

## Recommended CSV row

Use semicolon delimiter (Empik URLs contain commas):

```csv
empik;https://www.empik.com/harry-potter-a-kamen-mudrcu,p1047862,ksiazka-p;buy;1;200;3;a@a.pl;pwd;;PL;<webhook>
```
