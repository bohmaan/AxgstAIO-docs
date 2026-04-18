# PayPal auto-checkout

A minimal queue worker (`P` in the launcher menu) that opens every PayPal pay URL produced by a site module in your **default browser**, where you are already logged in. You click `Zaplatit / Pay` once per order — the worker handles the queueing, notifications, and done/failed housekeeping.

## Why not full automation?

We tried — thoroughly. Playwright/CDP-driven Chromium, real Chrome via subprocess with an unpacked extension, Firefox, every stealth patch in the book. PayPal's Arkose stack fingerprints all of these within seconds and either blocks the IP, freezes the login, or silently refuses the captcha. Your daily browser is the only thing that reliably gets through because it **is** a real human session.

So we let the robot do the boring part (watching for orders, opening URLs, bookkeeping) and keep the one thing PayPal actually wants a human for — the final button press.

## Run

```
(launcher) > P
```

The worker prints:

```
HH:MM:SS [pp] queue:  sessions/pp_queue
HH:MM:SS [pp] done:   sessions/pp_done
HH:MM:SS [pp] failed: sessions/pp_failed
HH:MM:SS [pp] waiting for pay URLs — Ctrl+C to stop
HH:MM:SS [pp] make sure you're logged in to PayPal in your default browser
```

Leave it running. In a **second terminal** run your buy task CSV; every successful order enqueues a pay URL.

When a pay URL arrives you'll see:

```
  ───────── NEW PAYMENT ─────────
  site:    mueller
  order:   #0700123456
  url:     https://www.paypal.com/checkoutnow?token=...
  Opening in your default browser — click 'Zaplatit' to pay.
  Press Enter after you finish paying (or wait 60s to auto-advance).
```

The URL opens in a new tab of your default browser. Click **Zaplatit / Pay**. Back in the terminal, hit Enter (or ignore it — the worker auto-advances after 60s so you can stack multiple orders). The queue file moves to `sessions/pp_done/`.

## File layout

```
sessions/
├── pp_queue/    pending pay URLs
├── pp_done/     processed orders
└── pp_failed/   malformed / missing URL
```

Each queue file is `{pay_url, order_id, site, email, queued_at}`. You can drop JSON files into `pp_queue/` by hand to re-queue an order.

## Stale queue items

On startup the worker asks whether to process any leftover files from a previous session:

```
Found stale queue item 1776529501234_0700123456.json — process it now? [y/N]:
```

Reply `y` to open it, anything else to skip.

## Auto-advance timeout

The 60-second wait between Enter / next order exists so you can walk away — five orders in a row will each pop up and auto-advance. Tune the value in `paypal.py → _process()` → `timeout = 60.0` if you want more or less time per payment.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Worker prints "NEW PAYMENT" but no browser opens | Your OS has no default browser registered — set one in OS settings, or set `BROWSER` env var |
| URL opens in the wrong browser (a stale Firefox etc.) | Change default browser in OS settings — the worker uses `webbrowser.open`, which honors your OS default |
| Browser opens but I'm not logged in to PayPal | Log in once in that browser, check "Remember this device", done |
| Want to re-run a done order | Move the file from `pp_done/` back to `pp_queue/` and the worker will reopen it |
