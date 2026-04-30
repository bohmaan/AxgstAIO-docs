# Footshop

**Code:** `footshop` / `fs`

## Region

CZ (CZK) and EU (EUR). The CSV `country_code` selects the storefront — `CZ` routes to `www.footshop.cz/cs/`, anything else to `www.footshop.eu/en/`.

Both domains share a single GraphQL backend at `/<lang>/graphql/` — login, ATC, and checkout all run through it.

## Sample CSVs

<div class="download-box">

- 📄 [footshop-buy.csv](/samples/footshop-buy.csv) — home delivery (GLS courier)
- 📄 [footshop-pickup.csv](/samples/footshop-pickup.csv) — Prague store pickup
- 📄 [footshop-register.csv](/samples/footshop-register.csv)

</div>

## Modes

### `buy` — home delivery, COD payment

```csv
fs;<pdp-url>;buy;1;5000;3;you@mail.com;YourPassword;42;CZ
```

Logs in (or restores cached session), parses sizes from the PDP HTML, ATCs the matching variant, runs the GraphQL checkout flow with **GLS courier + Dobírka (cash on delivery)**. The CSV `sizes` column accepts a single EU/US/UK value (auto-detected) or a comma-separated list with first-match-in-stock priority.

### `pickup` — Prague store pickup, COD payment

```csv
fs;<pdp-url>;pickup;1;5000;3;you@mail.com;YourPassword;42;CZ
```

Same flow as `buy` but the carrier is set to **Footshop Praha — Na Příkopě** (fallback **QNS Store 28. října**). No address-side step matters — the parcel waits in-store. Address from the CSV is still required for contact/notify.

### `register` — create an account

```csv
fs;;register;1;0;0;new@mail.com;NewP4ss;CZ;Jan;Novak;Hlavni;12;11000;Praha;+420777123456
```

Pure-JSON GraphQL register via the `Registration` mutation. Address from the CSV is **NOT** sent at this step — the server stores it automatically on the customer's first checkout (so the next `buy` run reuses it via `selectedDeliveryAddress`, skipping the form).

## Performance

- One small home GET to obtain the PrestaShop session cookie
- One PDP HTML scrape (server-rendered availability JSON, gives all sizes + variant ids in one shot)
- All other operations are GraphQL POSTs to `/cs/graphql/` (or `/en/graphql/`)
- Persistent login session (~6h TTL) in `~/.axgst/sessions/footshop_<hash>.json`
- Saved address auto-detected from `viewer.addresses` — second buy on the same account skips the address form entirely

## Anti-bot

None observed. Cloudflare just routes; no Akamai, Datadome, PerimeterX, or Turnstile gating. `curl_cffi chrome146` impersonation is enough.

## Known issues

- Carrier list varies by `country_code`. The bot prefers GLS first, falls back to the first non-pickup carrier in the response. If your country has no GLS or COD-compatible carrier, the run aborts with `COD not available (have: ...)`.
- COD is the only mapped payment. PayPal / card via Adyen are not in scope.
