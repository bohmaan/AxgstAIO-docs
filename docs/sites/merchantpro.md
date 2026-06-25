# MerchantPro (generic)

**Code:** `merchantpro` (alias `thepokemania`)
**Region:** RO / EU
**Modes:** `buy`
**Payment:** Netopia — **pay link forwarded to your webhook**
**Notes:** Generic module for any MerchantPro shop (e.g. thepokemania.com). Cheapest shipping is auto-selected. Fill the address columns.

## CSV row

```csv
merchantpro;https://www.thepokemania.com/example-product;buy;1;;500;3;guest@example.com;;;Ion;Popescu;+40712345678;Strada Lipscani;1;Bucuresti;030031;B;RO;;;
```

## Modes

- `buy` — add to cart, address, cheapest shipping, place order, get the Netopia pay link.
