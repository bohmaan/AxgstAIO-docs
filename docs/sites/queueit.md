# Queue-it (generic)

**Code:** `qit` / `queueit`

## What it does

Paste any `*.queue-it.net` queue page URL → bot waits in the queue → posts the **pass link** (`https://target/...?queueittoken=…`) to the webhook. Open that link in a real browser within ~1-5 min and you're past the queue.

Works for any Queue-it customer (Supreme, Adidas, Ticketmaster, public-sector portals, IPZS, …).

## Sample CSV

<div class="download-box">

- 📄 [queueit-pass.csv](/samples/queueit-pass.csv)

</div>

## Row

```csv
qit;<paste-queue-it-URL-here>;pass;1;0;1;;;;;;;;;;;
```

URL must be the queue page itself (with `c=`, `e=`, `t=` query params), e.g. `https://ipzs.queue-it.net/?c=ipzs&e=…&t=…&cid=it-IT`. The bot parses everything from the URL — only `delay` (poll interval, default 1 s) is read from the rest of the row.

## When to use this vs the per-site modules

- **Per-site module** (e.g. [IPZS](/sites/ipzs)) — handles queue **and** ATC + checkout.
- **Generic `qit` module** — handles **queue only**, returns a pass link to your browser. Use when the destination site has no AxgstAIO module of its own, or when you want manual checkout.

## Pass link timing

Pass tokens are short-lived (1-5 min). Have the destination site already open in a browser tab; when the webhook arrives, paste the URL and authenticate immediately.

## Known issues

| Error | Cause |
|-------|-------|
| `URL is not a queue-it.net link with c/e/t params` | URL must be the queue page (with `c=`, `e=`, `t=` query params). The destination site URL won't work — copy the URL bar after you're sent to the queue. |
| `enqueue: 403 …` | Some Queue-it customers reject datacenter IPs at the SPA-API layer — use a residential proxy in the customer's expected region. |
| `Queue poll timed out` | Queue is taking longer than 15 min. Just rerun. |
