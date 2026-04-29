# Pagro

**Code:** `pagro` / `pg`

## Region

Austria. Ships AT primary.

## Sample CSVs

<div class="download-box">

- 📄 [pagro-buy.csv](/samples/pagro-buy.csv)
- 📄 [pagro-register.csv](/samples/pagro-register.csv)

</div>

## Buy row

```csv
pg;https://www.pagro.at/<product-slug>.html;buy;1;100;3;you@mail.at;YourPassword;AT
```

End-to-end checkout via Magento REST V1 + Saferpay PaymentPage. Webhook receives the Saferpay hosted-page URL — open it in a real browser, fill in the card details, done.

OOS retry — Magento returns a clear `out of stock` error on cart-add for OOS items; the bot keeps retrying at the CSV `delay` interval until the item is back.

Login session is persisted (~6h TTL) so subsequent buys skip the CF solve + login.

## Register row

```csv
pg;;register;1;0;0;new@mail.at;NewP4ss;AT;Hans;Mueller
```

Pure HTTP register — no captcha. Address is added later through the user account, not at signup.

## Cloudflare

The site is gated by Cloudflare with an interactive Turnstile widget. The bot uses `cf_solver` (nodriver + pyautogui OS-level click) to clear it, then carries the `cf_clearance` cookie into the curl_cffi session.

Auth proxies are supported through a tiny local TCP forwarder — Chrome connects to `127.0.0.1` and the forwarder injects `Proxy-Authorization` on the upstream socket. No browser extension required.

A global cap of **5 concurrent CF solves** keeps small VPS hosts from being overwhelmed by a large task fleet. Tasks past the limit wait their turn — they don't fail.

::: tip Requirements
- `pip install nodriver pyautogui websockets`
- pagro's CF challenge requires an OS-level click on the Turnstile checkbox, so the bot needs a display. On a headless Linux VPS, run with `xvfb-run -a python launcher.py` (virtual display).
:::

## Known issues

- No size/option support — Pagro listings are simple SKUs without configurable variants.
- Saferpay tokenization (server-side card charge) needs merchant credentials we don't have, so checkout uses redirect mode only — the user must complete the card payment on Saferpay's hosted page.
