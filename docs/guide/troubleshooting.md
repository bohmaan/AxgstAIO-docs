# Troubleshooting

Common errors and fixes. If none match, check the [FAQ](/faq) or open an issue.

## Update / launcher

### `Update failed: [WinError 183] Cannot create a file when that file already exists`

Stale `.old` / `.tmp` files from a crashed previous update.

```powershell
del axgstaio.exe.old
del axgstaio.exe.tmp
```

Relaunch. Fixed permanently in v1.1.2+.

### `Update failed: HTTP 403`

GitHub API rate-limit or revoked embedded PAT. Wait an hour, or download manually from [releases](https://github.com/bohmaan/AxgstAIO/releases).

### Windows Defender quarantines the exe

Add the AxgstAIO folder to Defender exclusions:

```powershell
Add-MpPreference -ExclusionPath "C:\Users\<you>\Desktop\AxgstAIO"
```

### Launcher exits immediately without message

Usually a CSV parse error that the exe swallows before printing. Run from a PowerShell window so the error stays visible:

```powershell
cd C:\Users\<you>\Desktop\AxgstAIO
.\axgstaio.exe
```

## Login

### `Login failed — Akamai halt`

Your proxy IP has poor reputation. Akamai's bot manager returned `edge_error: halt`. Fixes:

- Switch to **residential proxies** (Bright Data, Oxylabs, Smartproxy).
- Wait 30–60 min for IP reputation to recover.
- Stagger task launches instead of running 20 at once.

### `Login failed — 401 Xsrf validation failed` (mobile flow)

Session missing `csrf-token` cookie. On v1.1.2+ this is handled automatically by the `/oauth2/authorize` warm-up hit. If you still see it, your proxy may be blocking certain endpoints — try a different proxy.

### `Login failed — 403 elevated-risk-score`

Zalando's risk engine flagged the session. Cause: IP reputation + fingerprint mismatch. Use residential proxies, or reduce per-IP concurrency.

### `Saved cookies expired` + full re-login every time

Cookies aren't persisting. Check that the `sessions/` folder has write permission. If you moved the exe to `C:\Program Files\…`, move it back to a user-writable folder.

## Checkout

### `Checkout failed — no saved address`

Account has no default delivery address. Two fixes:

1. Run a `mode=register` task first with `first_name`, `street`, etc. set.
2. Log into the site manually in a browser and add an address, then delete `sessions/<site>_<hash>.json` to force a cookie refresh.

### `Checkout failed — order-token-expired`

The checkout version went stale between steps. Just retry — v1.2.0+ refetches the version right before place-order.

### `Payment session/token not found`

The HTML payment page didn't include the `session_id` / JWT. Usually a symptom of **cart being empty** at checkout time (ATC failed silently). Check the preceding ATC step.

### `Order problem: <code>`

Site returned a specific place-order error. Common codes:

| Code | Meaning |
|------|---------|
| `place-order.order-token-expired` | Session stale — retry |
| `place-order.inventory-reserved-by-others` | Item went out of stock between ATC and place-order |
| `place-order.payment-method-invalid` | PayPal not available in your country for this item |
| `place-order.address-invalid` | Saved address has bad fields (missing country, postal code) |

## Performance

### Tasks are much slower than advertised

Causes, in order of likelihood:

1. **Cold session** — first task of the run has to do full login + Akamai warm-up (~8–10s). Subsequent tasks reuse cookies (~2s).
2. **Slow proxy** — test proxy latency; anything >500 ms adds up fast.
3. **Server-side latency** — Zalando trampoline + PayPal select are inherently 7–10s each. See [Running](/guide/running).

### High CPU / RAM at 20+ tasks

Each task spawns a thread with a curl_cffi session. At 50+ tasks, RAM spikes above 1 GB. Reduce concurrency.

## Webhooks

### No Discord messages even with URL set

1. Verify the URL: paste it into a browser, should return `401 Unauthorized` (correct — means the endpoint exists). A 404 means the webhook was deleted.
2. Check CSV column is named `webhook` exactly (lowercase).
3. Look for rate-limit errors in the bot's console output.

## Still stuck?

Open an issue on [GitHub](https://github.com/bohmaan/AxgstAIO/issues) with:
- Your launcher version banner
- The exact error message
- What you tried from this page
