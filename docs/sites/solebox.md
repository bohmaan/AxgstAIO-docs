# Solebox

**Code:** `sb` / `solebox`

## Region

EU storefront (`solebox.com/en-eu/`). Ships across the EU; pick destination
country in the browser at checkout time.

## Sample CSVs

<div class="download-box">

- 📄 [solebox-buy.csv](/samples/solebox-buy.csv)
- 📄 [solebox-register.csv](/samples/solebox-register.csv)

</div>

## Buy row

```csv
sb;https://www.solebox.com/en-eu/p/nike-air-max-95-og-big-bubble-neon-black-86718;buy;1;200;3;you@mail.de;P4ss;42;EU
```

Logs in, holds the size from the `sizes` column (EU sizing), and webhooks
the logged-in checkout link. Open it in your browser, finish the address +
card and you're done.

If the product URL already has a variant id appended (e.g.
`…-86718/411829`) the bot uses that variant directly and skips the size
lookup. Useful for hyped drops where you know exactly which variant you
want.

The `sizes` column accepts a comma-separated list (`41,42,43`) — first
matching variant in stock wins. Empty `sizes` = first available variant.

## Register row

```csv
sb;;register;1;0;0;new@mail.de;NewP4ss;;EU;Hans;Mueller;;;;;
```

Creates the account and immediately logs in, so the next `buy` task for
that email skips registration. Address is filled in your browser during
checkout — no separate `addy_fix` mode.

## Modes

- `buy` — login + ATC + handoff
- `register` — create account + login
- `login` — verify credentials, refresh cached session

## Requirements

- **Account required** — no guest mode. Run `register` once per email,
  then re-use the same email + password for `buy` tasks.
- **EU sizing** — sizes match what the product page shows (`41`, `42`,
  `42.5`, `43`, …).
- **Browser finish** — card entry runs on Solebox's payment provider page.
  The bot's job is to hold the cart; you finish payment.

## Known limitations

- **No card automation.** Card entry happens on the provider's hosted page
  with 3DS — that's browser-only by design.
- **No store / DPD pickup.** Standard home delivery only.
- **Session cache:** ~6h per email. Expired sessions trigger a fresh login
  automatically on the next task.
