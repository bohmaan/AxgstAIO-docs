# Solebox

**Code:** `sb` / `solebox`

## Region

EU (`solebox.com/en-eu/`). Ships across EU; pick your destination country in
the browser handoff at checkout.

## Sample CSVs

<div class="download-box">

- 📄 [solebox-buy.csv](/samples/solebox-buy.csv)
- 📄 [solebox-register.csv](/samples/solebox-register.csv)

</div>

## Architecture

Solebox front-end is two stacks glued together:

1. **Charybdis** — `api.solebox.com/sni-pl-prd-stor-we-char/v1/v1/*`. Runs
   user accounts, products, basket. Plain JSON REST. The bot drives this
   side fully.
2. **Scayle Cloud** — `snipes-live.checkout.api.scayle.cloud/next/api/co/v3/*`.
   Runs the checkout (address, payment option, confirmation). Cards go
   through a Saferpay-hosted page (`saferpay.com/VT2/mpp/...`) with 3DS in
   their own DOM. Not bypassable from headless HTTP.

Because of that split the bot does **register + login + ATC** and then
sends a logged-in `/en-eu/checkout` link via webhook. You finish address +
payment in the browser — the cart is held on the account and Saferpay does
the card entry.

## Buy row

```csv
sb;https://www.solebox.com/en-eu/p/nike-air-max-95-og-big-bubble-neon-black-86718;buy;1;200;3;you@mail.de;P4ss;42;EU
```

Login → ATC the product (size from the `sizes` column, EU sizing) → save
session → webhook with the logged-in checkout URL. Open that link in your
browser; the cart is pre-loaded, just enter address + card.

The size column accepts a comma-separated list (`41,42,43`); the bot picks
the first matching variant in stock. If no size is given, the bot picks the
first available variant.

## Variant URL

If your product link already has a variant id appended
(e.g. `…-86718/411829`), the bot uses that variant directly and skips the
size lookup. Useful for hyped drops where you know exactly which variant
you want.

## Register row

```csv
sb;;register;1;0;0;new@mail.de;NewP4ss;;EU;Hans;Mueller;;;;;
```

Creates the account on `api.solebox.com/users/auth/register` with `clientId
198` and the en-eu storefront, then logs in immediately so subsequent `buy`
tasks for the same email skip register.

The address is **not** written by `register` — Solebox stores the shipping
address on the Scayle side, which is filled by the user during browser
checkout. There is no `addy_fix` mode.

## Modes

- `buy` — login + ATC + handoff
- `register` — create account + login
- `login` (alias `login_check`) — verify credentials, refresh cached session

## Requirements

- **Account required.** No guest mode — every task must include `email` +
  `password`. Run `register` once per fresh email.
- **EU sizing.** The `sizes` column matches the EU size displayed on the
  product page (`41`, `42`, `42.5`, `43`, …).
- **Browser finish.** Card entry runs on Saferpay. The bot's job is to
  hold the cart; you finish the payment.

## Known limitations

- **No card automation.** Saferpay's hosted card iframe + 3DS challenge are
  browser-only. The bot drops you at the logged-in checkout link — you
  enter card details yourself.
- **No PayPal handoff URL.** Same reason — the PayPal token is minted by
  Scayle's `/state/order/confirmation/execute` after the user picks a
  payment option in the browser.
- **No DPD pickup or store pickup.** Only standard home delivery.
- **One session cache per email.** ~6h TTL; expired sessions trigger a
  fresh login automatically on the next task.
