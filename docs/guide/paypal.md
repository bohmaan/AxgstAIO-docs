# PayPal auto-checkout

A dedicated worker mode (`P` in the launcher menu) that opens a persistent-profile Chromium window and automatically completes the PayPal review step for any pay URL produced by a site module.

## When to use

Some site modules (currently [Mueller](/sites/mueller)) don't finish the order themselves — they select PayPal as payment and return a `paypal.com/checkoutnow?token=...` URL. The PayPal worker picks those URLs off a local queue and clicks through the review screen.

## First run

1. Start the launcher and pick **`P`** from the menu.
2. Pick a proxy file (residential strongly recommended) — PayPal bans datacenter IPs aggressively. Or press **`D`** for direct (likely to trip risk-engine on new accounts).
3. Chromium opens at `paypal.com/myaccount/summary` through the chosen proxy.
4. Log in with your PayPal account.
5. If PayPal asks for 2FA (SMS / phone), complete it once and leave **"Remember this device"** checked.
6. The worker prints `[pp] logged in — waiting for pay URLs` and starts tailing the queue.

The profile (cookies, device-trust token, autofill) is stored at `sessions/pp_profile/` and reused on subsequent runs — no 2FA next time.

::: warning If the account gets banned
PayPal sticks bans to (profile cookies + IP + browser fingerprint). To run a **new** account:
1. Delete `sessions/pp_profile/` — forces a fresh browser state
2. Pick a different residential proxy (one not previously seen on any banned account)
3. Log in with the new account; complete 2FA; leave "Remember this device" checked

The worker now launches Chromium with a stealth profile (hidden `navigator.webdriver`, `Europe/Berlin` timezone, `de-DE` locale, realistic UA and plugin list, `--disable-blink-features=AutomationControlled`) so PayPal's fingerprint check doesn't flag the session as automation.
:::

## Day-to-day run

Open **two terminals**:

| Terminal | Launcher option | What runs |
|----------|-----------------|-----------|
| A | `P` | PayPal worker, browser stays open |
| B | `1` (or your tasks CSV) | Site modules that produce pay URLs |

Whenever a task writes a pay URL, the worker sees the new file in `sessions/pp_queue/`, navigates to it, clicks the pay button, and moves the file to `sessions/pp_done/` on success (or `sessions/pp_failed/` on error).

Stop the worker with **Ctrl+C** — the profile stays logged in for next time.

## File layout

```
sessions/
├── pp_profile/     persistent Chromium user-data-dir (cookies, device trust)
├── pp_queue/       pending pay URLs (one .json per order)
├── pp_done/        successfully paid orders
└── pp_failed/      attempts that couldn't find the pay button
```

Each queue file contains `{pay_url, order_id, site, email, queued_at}`.

## Requirements

The worker needs Playwright installed on the machine running `axgstaio.exe`:

```
pip install playwright
playwright install chromium
```

Playwright's bundled Chromium is not included in the exe; install it once per machine.

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
| Worker reopens to `/signin` every run | Don't skip "Remember this device" — it's what keeps the session across runs |
| Account banned after login | PayPal linked the profile + IP to a prior ban — delete `sessions/pp_profile/` and use a different residential proxy |
| `Proxy authentication required` at launch | Proxy string missing credentials — use `host:port:user:pass` format |
| `could not find pay button` | PayPal A/B test with unknown layout — take a screenshot and add the new selector |
| Order paid twice | Queue file wasn't moved to `pp_done` due to filesystem lock — clear queue dir before relaunch |
