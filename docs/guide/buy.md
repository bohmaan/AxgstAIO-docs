# Buy mode

The default mode. Takes a product URL (or SKU/keyword on some sites) and runs the full checkout flow: login, probe sizes, pick one, add to cart, check out, return a PayPal URL.

## CSV row

```csv
site;url;mode;qty;max_price;delay_sec;email;password;sizes;country_code;webhook
zalando;https://www.zalando.cz/example.html;buy;1;3000;3;a@a.cz;pwd;M,L;CZ;<discord url>
```

## Flow

1. **Login** — either restored from cached session or fresh username-lookup → credentials-check → authenticate.
2. **Product lookup** — name, price, image (for the webhook) via site GraphQL or HTML parse.
3. **Price check** — if current price > `max_price`, task aborts.
4. **Clear cart** — existing items in the account's cart are removed so the draft order is clean.
5. **Probe sizes** — asks the site which simple-SKUs are in stock.
6. **Pick size** — matches against the `sizes` column (if present). Falls back to random from available. Retries every `delay_sec` if nothing matches.
7. **Add to cart** — GraphQL mutation.
8. **Checkout** — site-specific:
   - **Trampoline / create contract**
   - **Select PayPal** (or country default)
   - **Place order** → returns PayPal URL
9. **Webhook** — posts success/fail.

## Size matching

The `sizes` column is a comma-separated list of size labels. Matching is case-insensitive and ignores spaces. Partial matches count — `42` matches `42 EU`, `L` matches `L Long`.

If multiple sizes in `sizes` are available, the bot picks one at random.

## Waiting for restock

If no sizes from `sizes` are available, the bot prints `Waiting for restock...` and retries every `delay_sec` seconds indefinitely. Ctrl+C to stop.

## Max price guard

`max_price` is the ceiling. If the product price exceeds it, the task aborts before ATC. Prevents accidental checkout of a price-glitched item that was fixed.

## Supported payment

Currently all buy flows end at **PayPal**. Other methods (credit card, Klarna) may be added per-site in the future.

## Common failures

| Message | Cause | Fix |
|---------|-------|-----|
| `Login failed — Akamai halt` | Proxy IP flagged | Use residential proxies |
| `Checkout failed — no saved address` | Account has no default address | Register with address first, or add via the site UI |
| `Checkout failed — order-token-expired` | Session went stale between size probe and checkout | Retry |
| `ATC failed` | Item is fully out of stock | Task aborts |
| `Waiting for restock...` (infinite) | No sizes in `sizes` are in stock | Wait or update sizes |
