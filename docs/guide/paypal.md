# PayPal auto-checkout

A dedicated worker mode (`P` in the launcher menu) that opens a persistent-profile Chromium window and automatically completes the PayPal review step for any pay URL produced by a site module.

## When to use

Some site modules (currently [Mueller](/sites/mueller)) don't finish the order themselves — they select PayPal as payment and return a `paypal.com/checkoutnow?token=...` URL. The PayPal worker picks those URLs off a local queue and clicks through the review screen.

## Modes

After picking `P`, the launcher asks:

1. **Bundled Chromium** — Playwright spawns its own Chromium, routes through an optional proxy. Convenient but PayPal increasingly flags the bundled browser (login stuck on spinner, "access restricted" interstitial).
2. **Attach to Chrome** (recommended when (1) gets banned) — you open your normal Chrome with `--remote-debugging-port=9222` and Playwright attaches via CDP. PayPal cannot distinguish this from regular browsing because it *is* regular browsing.

### Mode 1 · Bundled Chromium

1. Pick a proxy file (residential strongly recommended). Or press `D` for direct.
2. Chromium opens at `paypal.com/myaccount/summary`.
3. Log in manually. Complete 2FA once and tick **"Remember this device"**.
4. The worker prints `[pp] logged in — waiting for pay URLs` and starts tailing the queue.

The profile (cookies, device-trust token, autofill) is at `sessions/pp_profile/` and reused on subsequent runs — no 2FA next time.

### Mode 2 · Attach to Chrome (CDP)

One-time setup:

```
# Windows — close all Chrome windows first, then in cmd/PowerShell:
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=C:\AxgstPPChrome
```

(Keep a dedicated `--user-data-dir` so this Chrome doesn't interfere with your daily profile.)

In that Chrome window:

1. Log in to PayPal normally. 2FA, remember device, all normal.
2. Leave the window open.

Back in the launcher: `P` → option `2` → hit Enter to accept default `http://127.0.0.1:9222`. The worker attaches and starts tailing the queue.

Because Playwright never spawns the browser and the CDP connection only sends standard DevTools commands, PayPal sees a completely normal Chrome session.

::: warning If the account gets banned on bundled Chromium
PayPal sticks bans to (profile cookies + IP + browser fingerprint). To run a **new** account on mode 1:
1. Delete `sessions/pp_profile/` — forces a fresh browser state
2. Pick a different residential proxy (one not previously seen on any banned account)
3. Log in with the new account; complete 2FA; leave "Remember this device" checked

If bundled keeps getting flagged (stuck login spinner, "access restricted" interstitial), switch to **Mode 2 · Attach to Chrome** — it's the nuclear option that works even when bundled is burned.
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
| Login POST hangs on spinner indefinitely | PayPal flagged the bundled Chromium — switch to Mode 2 (Attach to Chrome) |
| `Der Zugriff ist vorübergehend eingeschränkt` interstitial | Proxy IP is on PayPal's datacenter blacklist — use a different residential proxy or Mode 2 |
| Account banned after login | PayPal linked the profile + IP to a prior ban — delete `sessions/pp_profile/`, use a different residential proxy, or switch to Mode 2 |
| `could not connect to Chrome on :9222` | In Mode 2, start Chrome with `--remote-debugging-port=9222` before picking the option |
| `Proxy authentication required` at launch | Proxy string missing credentials — use `host:port:user:pass` format |
| `could not find pay button` | PayPal A/B test with unknown layout — take a screenshot and add the new selector |
| Order paid twice | Queue file wasn't moved to `pp_done` due to filesystem lock — clear queue dir before relaunch |
