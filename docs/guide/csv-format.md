# Tasks CSV

Tasks are defined in a semicolon- or comma-delimited CSV next to the exe (e.g. `tasks.csv`).

## Sample files

<div class="download-box">

- 📄 [tasks-buy.csv](/samples/tasks-buy.csv) — buy tasks across four sites
- 📄 [tasks-register.csv](/samples/tasks-register.csv) — register with address

</div>

Right-click → Save Link As.

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

## Delimiter

Semicolons are preferred — many product URLs contain commas. The loader auto-detects: if the header has a `;`, it splits on `;`.
