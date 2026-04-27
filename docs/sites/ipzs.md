# IPZS

**Code:** `ipzs`

## Region

Italy. Currency EUR. Site: [shop.ipzs.it](https://www.shop.ipzs.it/) — Italian State Mint (commemorative coins, numismatic series). Italian-resident accounts only — register your account manually on the site, then plug the credentials into the CSV.

## Sample CSV

<div class="download-box">

- 📄 [ipzs-buy.csv](/samples/ipzs-buy.csv)

</div>

## Buy row

```csv
ipzs;https://www.shop.ipzs.it/en/<product-slug>.html;buy;1;500;3;you@mail.cz;YourPassword;;IT;Mario;Rossi;Via Roma;1;00100;Roma;+393331234567
```

URL is the product page on `shop.ipzs.it/en/<slug>.html`. The bot logs in, adds to cart, runs checkout, and posts a PayPal Express approval URL to the webhook. Open that link to authorise the payment.

If the product is out of stock the bot retries automatically (controlled by `delay` in the CSV) — handles live restocks during a drop.

## Queue-it

When a hyped drop is gated by Queue-it, the bot passes the queue itself before running the buy flow — no browser needed, single curl session per task.

## Known issues

| Error | Cause |
|-------|-------|
| `Out of stock` retried forever | Expected on hyped drops — IPZS releases sell out in seconds. Set `delay` to control retry interval. |
| `Login failed` | Wrong email/password, or the account hasn't been registered manually on the site yet. |
| `Queue poll timed out` | Queue is taking longer than 15 min. Just rerun. |
