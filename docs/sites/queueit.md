# Queue-it (generic)

**Code:** `qit` / `queueit`

## What it does

Generic Queue-it pass-through solver — works for **any** site running [Queue-it](https://queue-it.com) (the `*.queue-it.net` SaaS waiting room used by Supreme drops, Adidas releases, Ticketmaster, public-sector portals, IPZS, and many more).

You feed it the queue page URL. The bot enqueues you, polls the queue's status endpoint until you're cleared, and posts the resulting **pass link** (`https://target/...?queueittoken=…`) to your webhook. Open that link in a real browser within ~1-5 min and Queue-it sets its HMAC-signed acceptance cookie on the destination domain — you're past the queue, no waiting.

## Sample CSV

<div class="download-box">

- 📄 [queueit-pass.csv](/samples/queueit-pass.csv)

</div>

## Row

```csv
qit;https://ipzs.queue-it.net/?c=ipzs&e=984prd854lnd777&t=https%3A%2F%2Fwww.shop.ipzs.it%2Fen%2Fcollezione2025&cid=it-IT;pass;1;0;1;;;;;;;;;;;
```

URL is the **queue page** — the one your browser shows when you hit a queued site. Format is always `https://{customer}.queue-it.net/?c={customer}&e={event}&t={target_url}&cid={culture}`. The bot parses all four pieces from the query string; you don't need to fill anything else in the CSV (only `delay` if you want a non-default poll interval).

## Modes

| Mode | What it does |
|------|--------------|
| `pass` (default) | Enqueue → poll status (~1 Hz) → return redirect URL. Pass link is sent to the webhook + printed in the console. |

## How it works

Three-step protocol, all over HTTP, no browser:

```
1) GET   /?c={customer}&e={event}&t={target}&cid={cid}
   → Queue-it sets `Queue-it-visitorsession` cookie

2) POST  /spa-api/queue/{customer}/{event}/enqueue
              ?cid={cid}&l=Theme+Generic&t={target}
   body: {"challengeSessions":[],"layoutName":"Theme Generic",
           "customUrlParams":"","targetUrl":"…","Referrer":""}
   → returns {queueId, layoutVersion}  (or {redirectUrl} if queue idle)

3) POST  /spa-api/queue/{customer}/{event}/{queueId}/status
              ?cid={cid}&l=Theme+Generic&t={target}
              &seid={visitor_session}&sets={millis_since_enqueue}
   body: {"targetUrl":"…","customUrlParams":"",
           "layoutVersion":N,"layoutName":"Theme Generic",
           "isClientRedayToRedirect":true,"isBeforeOrIdle":false}
   → polled every ~1 s. When the queue lets us in:
     {"redirectUrl":"https://target/…?queueittoken=…"}
```

That `redirectUrl` is the pass link. It's signed by Queue-it's central servers and the destination site's queueit-intercept module validates the token (`queueittoken` is a JWT-style HMAC over EventId + QueueId + IssueTime + RedirectType, signed with the secret configured in the customer's admin panel). When the user opens that URL in a browser, the destination Set-Cookies an HMAC-signed acceptance cookie (`QueueITAccepted-{prefix}_{event}`) and 302s to the clean target.

## When to use this vs the per-site modules

- **Per-site module** ([IPZS](/sites/ipzs) etc.) — handles queue **and** ATC + checkout in one task. Use this when your goal is full automation through to checkout.
- **Generic `qit` module** — handles queue **only**, returns a pass link to your browser. Use this when:
  - The destination site has no AxgstAIO module (Supreme drops, Ticketmaster, etc.)
  - You want to do checkout manually in your own browser
  - You're using a third-party bot for the destination but it can't solve queue-it
  - You're in a queue-it-only situation (a non-shop public service queue)

## Pass link timing

Queue-it pass tokens are **short-lived**: typically 1-5 min, configured per customer. The bot emits the pass link the moment the queue lets us through, so you're in a hurry to use it. For best results: have the destination site already open in a browser tab; when the webhook arrives, paste the URL into that tab and authenticate immediately.

## Webhook payload

The pass link arrives in the standard AxgstAIO success embed in the `pay_url` field, alongside `Queue-it pass: {customer}` as the product name. Click through to the URL — that's the magic link.

## Known issues

| Error | Cause |
|-------|-------|
| `URL is not a queue-it.net link with c/e/t params` | The URL must be the queue page itself (with `c=`, `e=`, `t=` query params). The destination URL or short-link won't work — copy the URL bar after you're sent to the queue. |
| `enqueue: 403 …` | Some Queue-it customers reject mid-Atlantic / datacenter IPs at the SPA-API layer. Use a residential proxy in the customer's expected region (most are EU/US for retail, region-locked for public-sector). |
| `Queue poll timed out` | The queue is taking longer than 15 min. Increase `delay` in CSV or just rerun. |

## Performance

- Idle queue: pass link returned in ~1 s straight from `enqueue`
- Active queue: ~1 poll/s; total time = position-ahead-of-you / (people-per-second cleared); same as a real visitor
- One curl_cffi session per task; no browser ever opened
