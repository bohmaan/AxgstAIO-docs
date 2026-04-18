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

## Buy row

```csv
zalando;https://www.zalando.cz/example.html;buy;1;3000;3;you@mail.com;P4ss;M,L;CZ
```

## Register row

```csv
zalando;;register;1;0;0;new@mail.com;NewP4ss;Jan;Novak;Konevova;135;13000;Praha;CZ;+420777888999
```

## Known issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Login failed — Akamai halt` | Proxy flagged | Use residential proxies |
| `403 elevated-risk-score` (register) | Bad IP reputation | Residential proxies mandatory for register |
| `Checkout failed — no saved address` | Account has no default address | Register with address columns, or add via site UI |
| `order-token-expired` | Stale checkout version | Retry (auto-refetch in v1.2.0+) |
