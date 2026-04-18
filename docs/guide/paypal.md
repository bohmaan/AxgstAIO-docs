# PayPal auto-checkout

A dedicated worker mode (`P` in the launcher menu) that launches your real Chrome (or Edge) with a local Manifest-V3 extension that auto-clicks the pay button for every `paypal.com/checkoutnow?token=...` URL produced by site modules.

## Why this architecture

PayPal's Arkose detector fingerprints CDP-driven browsers (Playwright, Puppeteer, Selenium) and hangs their sessions on login — even real Chrome launched via `channel="chrome"` gets blocked because Playwright attaches via CDP. The only technique that reliably survives is:

1. **Launch real Chrome via subprocess** (no Playwright, no CDP attached)
2. **Load an unpacked extension** that does the clicking — extension content scripts are indistinguishable from regular user interaction (real `isTrusted=true` events, real browser context, real fingerprint)
3. **Bridge the Python queue to the extension over local HTTP** (background service worker polls `http://127.0.0.1:<ephemeral>/next`)

PayPal sees your daily Chrome with a mundane extension loaded (as if you'd installed a cashback coupon addon). Nothing for Arkose to pattern-match on.

## Requirements

- Google Chrome (or Microsoft Edge) installed on the machine. Playwright is **not** required.
- Override the Chrome path via env var if auto-discovery misses it: `set AXGSTAIO_CHROME="C:\path\to\chrome.exe"` before launching.

## First run

1. Start the launcher and pick **`P`**.
2. Pick a proxy or **`D`** for direct.
3. The worker:
   - Generates a fresh MV3 extension at `sessions/pp_extension/`
   - Starts a tiny HTTP bridge on `127.0.0.1:<random>`
   - Launches Chrome: `chrome.exe --load-extension=sessions/pp_extension --user-data-dir=sessions/pp_profile https://www.paypal.com/myaccount/summary`
4. Log in to PayPal in that Chrome window. Complete 2FA once, leave **"Remember this device"** checked. The `sessions/pp_profile/` dir keeps cookies forever.
5. Leave Chrome open.

The worker's terminal prints `[bridge] handed out ...` when a pay URL gets consumed.

## Day-to-day run

Open **two terminals**:

| Terminal | Launcher option | What runs |
|----------|-----------------|-----------|
| A | `P` | HTTP bridge + real Chrome with extension |
| B | `1` (or your tasks CSV) | Site modules that produce pay URLs |

Whenever a task writes a pay URL, the extension sees it within ~2s, navigates the active PayPal tab, finds the pay button, clicks, and reports back. Queue file moves to `pp_done/` on success or `pp_failed/` on error.

Ctrl+C in terminal A stops the bridge. Chrome stays open — close it manually when you're done.

## File layout

```
sessions/
├── pp_extension/   auto-generated MV3 extension (manifest.json, background.js, content.js)
├── pp_profile/     persistent Chrome user-data-dir (cookies, device trust, cache)
├── pp_queue/       pending pay URLs (one .json per order)
├── pp_done/        successfully paid orders
└── pp_failed/      attempts that couldn't find the pay button
```

## Proxy support

The worker accepts proxies in `host:port:user:pass` or `user:pass@host:port` or `scheme://...` form. Chrome's `--proxy-server=` CLI flag does not consume credentials — authenticated proxies will pop a one-time auth dialog you fill in. Unauthenticated or IP-whitelisted proxies plug in seamlessly.

## Pay-button detection

The content script tries in order:

1. `#one-time-cta` — current PayPal checkout layout
2. `#payment-submit-btn` — legacy layout
3. `[data-testid="submit-button-initial"]` / `[data-testid="submitButton-initial"]`
4. Button text — `Zaplatit`, `Jetzt bezahlen`, `Bezahlen`, `Pay Now`, `Pay`, `Complete Purchase`

After clicking it waits up to 30s for a redirect away from paypal.com (or a `/success` / `/returnurl` substring) to confirm the payment went through.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `no Chrome/Edge binary found` | Install Chrome, or set `AXGSTAIO_CHROME` env var to the chrome.exe path |
| Extension didn't load / nothing happens | Go to `chrome://extensions`, enable Developer Mode, verify "AxgstAIO PayPal Worker" is listed and enabled |
| Pay button never clicks | Pay page layout changed — capture DOM, add the new selector to `_CONTENT_JS` in paypal.py |
| `pay button never appeared` in `pp_failed` | URL redirected away from `/pay`/`/checkoutnow` (e.g. risk challenge) — queue item moves to failed; retry manually |
| Proxy prompts for auth every run | Chrome CLI can't consume proxy creds; use an IP-whitelisted residential proxy or enter creds once per session |
| Two Chrome windows open and extension only works in one | `--user-data-dir` collision with your daily Chrome — use a dedicated `sessions/pp_profile/` (default) and don't override it |
