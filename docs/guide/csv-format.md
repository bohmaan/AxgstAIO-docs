# Tasks CSV

Tasks are defined in a semicolon- or comma-delimited CSV next to the exe (e.g. `tasks.csv`).

## Sample files

<div class="download-box">

- 📄 [tasks-buy.csv](/samples/tasks-buy.csv) — buy tasks across multiple sites
- 📄 [tasks-register.csv](/samples/tasks-register.csv) — register with address

</div>

Right-click → Save Link As. Per-site CSVs are linked from each [Site](/sites/) page.

Samples include **all** supported columns; unused columns stay empty. Unknown columns are ignored, so you can keep one unified header for every CSV.

## Required columns

| Column | Example | Notes |
|--------|---------|-------|
| `site` | `zalando` | Site code — see [Sites](/sites/). |
| `url` | `https://…` or SKU or empty | Product URL. Empty for register. SKU/keyword on sites that support search. |
| `mode` | `buy` / `register` | Task type. |
| `qty` | `1` | Quantity. Most sites respect `1` only. |
| `max_price` | `3000` | Price ceiling; task aborts above. |
| `delay_sec` | `3` | Restock probe interval. |
| `email` | `you@mail.com` | Account email. |
| `password` | `P4ss!` | Account password. |

## Register columns

Required only for `mode=register`:

| Column | Example |
|--------|---------|
| `first_name` | `Jan` |
| `last_name` | `Novak` |
| `street` | `Konevova` |
| `building_number` | `135` |
| `postal_code` | `13000` |
| `city` | `Praha` |
| `country_code` | `CZ` |
| `phone` | `+420777888999` |

## Buy columns

Optional on `mode=buy`:

| Column | Example | Notes |
|--------|---------|-------|
| `sizes` | `M,L,XL` | Preferred sizes, first available wins. Empty = random. |
| `country_code` | `CZ` | Used when URL doesn't imply a region. |

## Payment selection (`card_number`)

Most sites read card details from the `card_number` / `expiry` / `cvv` columns. A few sites support alternative payment methods by overloading the `card_number` column with a keyword instead of a real PAN:

| `card_number` value | Effect | Sites that support it |
|---|---|---|
| `4111…` (real PAN) | Standard card checkout | All card-supporting sites |
| `gpay` / `googlepay` | Google Pay handoff (URL in webhook) | Mediaexpert |
| `cod` / `pobranie` / `zapobraniem` / `cashondelivery` | Cash on Delivery — courier brings goods, you pay in cash on arrival | Mediaexpert, Footshop |
| `instore` / `odbior` / `pickup` | Pickup at physical store, pay in cash at register | Mediaexpert |
| `instorecod` / `instorecard` | Pickup at physical store, pay by card at register | Mediaexpert |

When using `instore` / `instorecod`, the bot resolves the nearest store by the CSV `postal_code` automatically. To pin a specific store, fill in either:

- `discount` CSV column → integer POS id (per-task override)
- `config.json` → `mediaexpert_default_pos_id` (global default for that site)
- env `HOP_ME_DEFAULT_POS_ID` (CI / one-shot override)

The bot looks them up in that order; first match wins, automatic nearest-store search is the fallback.

## Delimiter

Semicolons are preferred — many product URLs contain commas. The loader auto-detects: if the header has a `;`, it splits on `;`.
