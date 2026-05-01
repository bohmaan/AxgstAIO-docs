# SK Store / Warsaw Sneaker Store

**Codes:** `skstore` (skstore.eu) · `wss` (warsawsneakerstore.com)

Both shops share the same backend, so one module covers both. Pick the shop with the `site` column in your CSV.

## Region

PL only. Delivery is offered to PL/CZ/SK/DE/AT/HU/RO/LT — set the destination via `country_code` and the bot picks a default carrier (DHL Europa for non-PL, InPost paczkomat for PL).

## Sample CSV

<div class="download-box">

- 📄 [skstore-buy.csv](/samples/skstore-buy.csv)

</div>

## Modes

### `buy` — guest checkout, PayPal payment

```csv
skstore;<pdp-url>;buy;1;5000;3;you@mail.com;;;42;CZ;Jan;Novak;+420777123456;Hlavni;12;Praha;11000;
```

`wss` works the same — just swap the site code:

```csv
wss;<pdp-url>;buy;1;5000;3;you@mail.com;;;42;CZ;Jan;Novak;+420777123456;Hlavni;12;Praha;11000;
```

The bot opens the cart as a guest (no account needed), fills the address from the CSV, picks a shipping option for your country, and finalises with **PayPal**. The webhook ships you the final `…/order/finish/<id>/<hash>` link — open it in any browser, log into PayPal, pay.

`password` and `discount` columns are unused for this module — leave them empty.

## Discount codes

Put the code in the `discount` CSV column. Example: `erem15` is a working public code.

## CapSolver / presolve mode

Order finalisation requires a **reCAPTCHA v2** checkbox solve. Set `CAPSOLVER_KEY` in your environment so the bot can solve it automatically:

```bash
# macOS / Linux
export CAPSOLVER_KEY="CAP-XXXXXXXXXXXXXXXX"

# Windows (PowerShell)
$env:CAPSOLVER_KEY="CAP-XXXXXXXXXXXXXXXX"
```

The solve runs in the background **starting from the moment the cart is created** — by the time the address + payment steps finish, the token is usually already waiting. This shaves ~10–15s off every order.

If the token is rejected, the bot retries up to 3× with fresh tokens before giving up and posting the manual `/order/payment` URL to the webhook.

If `CAPSOLVER_KEY` isn't set the bot still places the cart, picks delivery + PayPal, and webhooks the manual `/order/payment` link — you click "Zamawiam i płacę" yourself.

## Notes

- Manual CC is the fallback — leave `card_number` empty in CSV. The `/order/finish/...` link goes to PayPal; you log in there and pay (no card data ever touches the bot).
- Sizing in the CSV uses the EU shoe size shown on the PDP (e.g. `42`, `9.5`).
- Cart hold protection is handled by the shop — the bot doesn't try to bypass it.
