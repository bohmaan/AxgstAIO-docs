# CatchYourCards

**Code:** `catchyourcards` / `cyc`

## Region

Netherlands. Currency EUR. Site: [catchyourcards.nl](https://catchyourcards.nl/) — Pokémon TCG / One Piece / Lorcana / Magic: The Gathering specialty store.

## Sample CSV

<div class="download-box">

- 📄 [catchyourcards-buy.csv](/samples/catchyourcards-buy.csv)

</div>

## Buy row

```csv
cyc;https://catchyourcards.nl/<product-slug>/;buy;1;50;3;you@mail.nl;;;NL;Test;Buyer;Hooftlaan 1;1000AA;Amsterdam;0612345678
```

URL is the product page on `catchyourcards.nl/<slug>/`. Numeric product IDs in column 2 are also accepted (useful pre-drop when only the ID is known).

The bot opens a Chrome window for the Cloudflare clearance, then does ATC + checkout via HTTP. A Mollie iDEAL payment URL is posted to the webhook — open it to authorise.

## Modes

| Mode | What it does |
|------|--------------|
| `buy` | Default — fastest path through ATC + checkout. ~3-4 s end-to-end after CF clearance. |
| `test` | Probe mode — tries all 8 ATC paths and writes a debug log. Useful during real Queue-Fair drops to validate which ATC paths still pass. |

## Proxy

Auth-required HTTP proxies are supported via a built-in local relay — Chrome never sees the credentials and never pops up the proxy auth dialog.

Accepted formats:
- `host:port`
- `host:port:user:pass`
- `user:pass@host:port`
- `http://user:pass@host:port`

## Known issues

| Error | Cause |
|-------|-------|
| `Could not pass Cloudflare` | The bot needs a visible display to clear Cloudflare. On a headless server, run under a virtual display (`xvfb-run` on Linux). |
| `wc_order_limiter_rate_limit_exceeded` | The shop is rate-limiting repeat orders from the same account/IP. Wait ~15 min or rotate email/proxy. |
| `URL redirects → product likely removed` | Product was unpublished after a drop. Use a live URL or a numeric product ID known pre-drop. |
