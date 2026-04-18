# Mueller

**Code:** `mueller` / `ml`

## Region

Germany only. Currency EUR.

## Sample CSVs

<div class="download-box">

- 📄 [mueller-buy.csv](/samples/mueller-buy.csv)
- 📄 [mueller-register.csv](/samples/mueller-register.csv)

</div>

## Buy row

```csv
ml;https://www.mueller.de/p/slug-PPN3163472/;buy;1;100;3;you@mail.de;P4ss1234!;;DE
```

The product URL must contain the article code suffix: either `...-PPN<digits>/` (main catalogue) or `...-IPN<digits>/` (partner items). The module extracts the trailing numeric code.

## Register row

```csv
ml;;register;1;0;0;new@mail.de;NewP4ss1234!;;DE;Hans;Mueller;Musterstrasse;12;10115;Berlin;+4915112345678
```

Register creates the account via `CreateMeV2`, logs in via NextAuth, and saves the provided address with `isDefaultAddress: true` in one shot.

::: tip Password policy
Mueller requires **8+ chars with upper + lower + digit + symbol**. Weak passwords fail with `PWD_TOO_WEAK`.
:::

## Checkout

- Shipping: **Lieferung nach Hause** (`homedelivery_de`) — currently the only supported mode
- Payment: **PayPal** — the module places the order and returns a `paypal.com/checkoutnow?token=...` URL that you open in your browser to finish paying.

## Loop mode

`mode=loop` places one order, then immediately restarts (ATC → checkout → place order) — keeps running until you stop the task.

```csv
ml;https://www.mueller.de/p/slug-PPN3163472/;loop;1;100;3;you@mail.de;P4ss1234!;;DE
```

Login happens once at start; only the buy iteration repeats. Each iteration prints a fresh PayPal URL.

## Known issues

| Error | Cause |
|-------|-------|
| `Register failed — password too weak...` | Password doesn't meet 8+ char upper+lower+digit+symbol policy |
| `Login failed — credentials` | Wrong email/password, or account not verified yet |
| `Bad URL — no product code` | URL missing `PPN<digits>/` or `IPN<digits>/` suffix |
| `Out of stock — retry in Xs` | ATC returned no entry for the product — module auto-retries |
| `Order failed — no PayPal URL` | `PlaceOrders` response didn't include a PayPal redirect — usually an address/stock validation error (check `errors[0].message`) |

## Anti-bot notes

Mueller deploys [Anubis](https://github.com/TecharoHQ/anubis) (proof-of-work interstitial) on HTML page routes, but **not** on the `api/auth/*` or `backend.prod.ecom.mueller.de` GraphQL endpoints the module uses. No PoW solving is required.
