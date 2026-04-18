# Zalando

**Code:** `zalando` / `zal`

## Regions

Auto-detected from URL TLD. `country_code` is used only when the URL is empty (register tasks).

| TLD | Country | Domain |
|-----|---------|--------|
| `.cz` | CZ | www.zalando.cz |
| `.de` | DE | www.zalando.de |
| `.pl` | PL | www.zalando.pl |
| `.at` | AT | www.zalando.at |
| `.fr` | FR | www.zalando.fr |
| `.es` | ES | www.zalando.es |
| `.co.uk` | GB | www.zalando.co.uk |
| `.nl` | NL | www.zalando.nl |
| `.sk` | SK | www.zalando.sk |
| `.it` | IT | www.zalando.it |

## Sample CSV

<div class="download-box">

- 📄 [zalando-buy.csv](/samples/zalando-buy.csv)

</div>

## Buy row

```csv
zalando;https://www.zalando.cz/example.html;buy;1;3000;3;you@mail.com;P4ss;M,L;CZ
```

::: warning Register not supported
Zalando register is temporarily disabled. Create accounts manually via the website and add a default address before running buy tasks.
:::

## Known issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Login failed — Akamai halt` | Proxy flagged | Use residential proxies |
| `Checkout failed — no saved address` | Account has no default address | Add one via the Zalando website |
| `order-token-expired` | Stale checkout version | Retry (auto-refetch in v1.2.0+) |
