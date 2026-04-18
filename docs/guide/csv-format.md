# CSV Task Format

Tasks are defined in a CSV (or semicolon-delimited) file. The launcher auto-detects the delimiter — if the header line contains `;`, it uses semicolons; otherwise commas.

::: tip
**Use semicolons** whenever your URLs contain commas (common on Empik, Zalando Lounge, etc.). The launcher handles both.
:::

## Required columns

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| `site` | string | `zalando` | See [site short codes](#site-short-codes). |
| `url` | string | `https://www.zalando.cz/...` | Product URL, SKU, or keyword (site-dependent). |
| `mode` | string | `buy` | Either `buy` or `register`. |
| `qty` | int | `1` | Quantity. Most sites only respect 1. |
| `max_price` | float | `10000` | Price cap. If product is above, the task aborts. |
| `delay_sec` | int | `3` | Delay between restock probes. |
| `email` | string | `you@example.com` | Account email. Created if `mode=register`. |
| `password` | string | `SecureP4ss!` | Account password. |

## Optional columns (for register + address)

| Column | Required for | Example |
|--------|--------------|---------|
| `first_name` | register | `Jan` |
| `last_name` | register | `Novák` |
| `street` | register | `Koněvova` |
| `building_number` | register | `135` |
| `postal_code` | register | `130 00` |
| `city` | register | `Praha` |
| `country_code` | register, buy | `CZ` |
| `phone` | register (some sites) | `+420 123 456 789` |
| `sizes` | buy | `M,L,XL` |
| `webhook` | any | `https://discord.com/api/webhooks/...` |

## Site short codes

| Long | Short | URL pattern |
|------|-------|-------------|
| `zalando` | `zal` | `https://www.zalando.<tld>/...` |
| `sportsshoes` | `ss` | `https://www.sportsshoes.com/...` or SKU/keyword |
| `basketballemotion` | `be` | `https://www.basketballemotion.com/...` or SKU |
| `futbolemotion` | `fe` | `https://www.futbolemotion.com/...` or SKU |
| `empik` | (default) | `https://www.empik.com/...` |
| `elbenwald` | `ew` | `https://www.elbenwald.de/...` |
| `footdistrict` | `fd` | `https://footdistrict.com/...` |
| `mycomics` | `mc` | `https://www.mycomics.com/...` |
| `sportvision` | `sv` | `https://www.sportvision.rs/...` |
| `dfn` | `dfn` | `https://www.defshop.com/...` |

## Sample CSV

```csv
site;url;mode;qty;max_price;delay_sec;email;password;sizes;country_code;webhook
zalando;https://www.zalando.cz/example-product.html;buy;1;3000;3;a@a.cz;pwd1;M,L;CZ;https://discord.com/api/webhooks/xxx
ss;https://www.sportsshoes.com/product/xxx;buy;1;200;3;b@b.com;pwd2;42,43;GB;https://discord.com/api/webhooks/xxx
be;BASKET-SKU-123;buy;1;80;2;c@c.es;pwd3;L;ES;
zalando;;register;1;0;0;new@mail.com;newpwd;;CZ;
```

Empty `sizes` = pick first available. Empty `webhook` = no Discord notification.

## Column tolerances

- Unknown columns are ignored.
- Missing optional columns fall back to sensible defaults.
- `qty`, `max_price`, `delay_sec` default to 1 / 0 / 3 if missing or malformed.
- Trailing whitespace is stripped from every field.

## Debugging your CSV

If launcher prints `CSV missing columns: <list>`, add those exact column headers to the first row. If it prints nothing after "Loaded X proxies", check the delimiter.
