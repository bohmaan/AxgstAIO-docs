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
| `Could not pass Cloudflare` | nodriver / pyautogui not installed. Run `python -m pip install nodriver pyautogui websockets`. |
| `cf_solver error: maximum recursion depth` | nodriver 0.48 bug on Python 3.14. Pin: `pip install --force-reinstall "nodriver==0.46"`. |
| `wc_order_limiter_rate_limit_exceeded` | WordPress plugin blocking rapid repeat orders. Wait ~15 min or rotate email/IP. |
| `URL redirects → product likely removed` | Product was unpublished after a drop. Use a live URL or a numeric ID known pre-drop. |
