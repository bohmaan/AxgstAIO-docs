# PayPal auto-checkout

A dedicated worker mode (`P` in the launcher menu) that opens a plain Chrome guest window and automatically clicks the pay button on every `paypal.com/checkoutnow?token=...` URL produced by site modules.

## When to use

Some site modules (currently [Mueller](/sites/mueller)) don't finish the order themselves — they select PayPal as payment and return a pay URL. The PayPal worker picks those URLs off a local queue and clicks through the review screen.

## How it runs

1. Launch the tool and pick **`P`**.
2. Pick a proxy from `proxy/` (residential strongly recommended) or **`D`** for direct.
3. A plain Chrome guest window opens at `paypal.com/myaccount/summary` through the chosen network — no stealth flags, no persistent profile, just a fresh guest session.
4. Log in to PayPal in that window (2FA as usual). Don't worry about "Remember this device" — the session lasts only for this run.
5. The worker prints `[pp] logged in — waiting for pay URLs` and starts tailing the queue.
6. Leave the window open; when a task enqueues a pay URL, the worker navigates to it and clicks **Zaplatit / Bezahlen / Pay Now**, then moves the queue file to `pp_done/` (or `pp_failed/` on error).

Ctrl+C to stop. Next run starts with a fresh guest window and you log in again.

::: warning If your home IP gets banned
PayPal logs your IP from every failed login attempt. After a few bot-like sessions your real IP gets a 24–72h block (`Der Zugriff ist vorübergehend eingeschränkt`). Workarounds:
- Pick a residential proxy before the worker starts
- Or run from a different network (mobile hotspot, different WiFi)
- Or just wait 24–72h for the block to expire
:::

## Day-to-day run

Open **two terminals**:

| Terminal | Launcher option | What runs |
|----------|-----------------|-----------|
| A | `P` | PayPal worker, Chrome guest stays open |
| B | `1` (or your tasks CSV) | Site modules that produce pay URLs |

## File layout

```
sessions/
├── pp_queue/       pending pay URLs (one .json per order)
├── pp_done/        successfully paid orders
└── pp_failed/      attempts that couldn't find the pay button
```

Each queue file contains `{pay_url, order_id, site, email, queued_at}`.

## Requirements

```
pip install playwright
playwright install chromium
```

The worker prefers the system-installed Chrome (`channel="chrome"`) and falls back to Playwright's bundled Chromium if Chrome isn't present. Either is fine.

## Pay-button detection

The worker tries selectors in this order:

1. `#one-time-cta` — current PayPal checkout layout (locale-independent)
2. `#payment-submit-btn` — legacy `/checkoutnow` layout
3. Locale text — `Zaplatit`, `Jetzt bezahlen`, `Bezahlen`, `Pay Now`, `Pay`, `Complete Purchase`
4. `button[type="submit"]` as last resort

If PayPal changes the layout, add a new selector to `paypal.py → _pay_one()` and rebuild.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `Playwright not installed` | Run the two install commands above |
| Login POST hangs on spinner indefinitely | PayPal risk engine flagged this session — start again with a clean run (no residual auth state), try a different network if it persists |
| `Please wait while we perform security check` hangs forever | Same — Arkose flagged the session; relaunch the worker to get a fresh guest window |
| `could not find pay button` | PayPal A/B test with unknown layout — take a screenshot and add the new selector |
| Order paid twice | Queue file wasn't moved to `pp_done` due to filesystem lock — clear queue dir before relaunch |
