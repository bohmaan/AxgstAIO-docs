# PayPal auto-checkout

The existing **QuickTask browser extension** also auto-clicks the PayPal pay button for orders queued by the CLI. No separate worker, no `P` menu option — just install the extension once, configure `qt_url` / `qt_key`, and answer `y` when a PP-checkout task asks.

## How it works

```
  CLI                                     Cloudflare worker              QT extension
  ───                                     ─────────────────              ────────────
  task finishes order        ──POST /pp/push─▶  KV[<qt_key>] ◀──GET /pp/pull──  polling on
  (prompted y at start)                                                         *.paypal.com/*

  ◀──200────                                    KV remove            ──POST /pp/done
                                                                      (after click + redirect)
```

The user's `qt_key` is the shared secret — it routes pay URLs to the right machine's extension. Nothing leaves your own worker.

## Prompt at task start

```
[Task 1] Auto-pay via PayPal extension? [y/N]:
```

- `y` → pay URLs produced by that task get pushed to the extension queue.
- Enter / `n` → just print the URL, you pay manually.

The answer is remembered per-task (loop mode asks once and reuses).

## Extension setup

1. Load the QuickTask extension folder (`quicktask-ext/`) in Chrome → `chrome://extensions` → Developer mode → **Load unpacked**. Or just reload if you already had it installed — `content-paypal.js` is picked up automatically after the version bump.
2. Click the QuickTask toolbar icon → Settings → paste your `Worker URL` and `QT_KEY` → Save.
3. Open any paypal.com tab and log in (one tab is enough — keep it open while tasks run). The content script polls every ~2s.

## Cloudflare worker endpoints (add to your existing `quicktask.axgstaio.workers.dev`)

The CLI expects three new routes on the same worker. Minimal implementation using Workers KV:

```js
// POST /pp/push?key=<qt_key>
//   body: {id, url, order_id, site, email}
//   → stores job at PP:<qt_key>:<id>
async function push(request, env) {
  const key = new URL(request.url).searchParams.get("key");
  const body = await request.json();
  await env.PP.put(`${key}:${body.id}`, JSON.stringify(body));
  return Response.json({ ok: true });
}

// GET /pp/pull?key=<qt_key>
//   returns oldest pending job or 204
async function pull(request, env) {
  const key = new URL(request.url).searchParams.get("key");
  const list = await env.PP.list({ prefix: `${key}:` });
  if (!list.keys.length) return new Response(null, { status: 204 });
  const first = list.keys[0];
  const val = await env.PP.get(first.name);
  return val ? new Response(val, { headers: { "content-type": "application/json" } })
             : new Response(null, { status: 204 });
}

// POST /pp/done?key=<qt_key>
//   body: {id, ok, reason}  → delete KV entry
async function done(request, env) {
  const key = new URL(request.url).searchParams.get("key");
  const body = await request.json();
  await env.PP.delete(`${key}:${body.id}`);
  return Response.json({ ok: true });
}
```

Bind a KV namespace named `PP` in `wrangler.toml`. TTL ~24h on `put` is a good idea so abandoned jobs don't linger:

```toml
kv_namespaces = [
  { binding = "PP", id = "..." },
]
```

## Verify it's wired up

With the extension installed + paypal.com tab open, open the tab's DevTools console (`F12`). You should see:

```
[pp-ext] polling on https://www.paypal.com/myaccount/summary
```

Enqueue something manually to smoke-test:

```
curl -X POST "$QT_URL/pp/push?key=$QT_KEY" \
  -H 'content-type: application/json' \
  -d '{"id":"smoketest","url":"https://www.paypal.com/checkoutnow?token=YOUR_TEST_TOKEN","order_id":"","site":"test","email":""}'
```

Within ~2s the paypal.com tab should navigate to that URL and click the pay button.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Prompt never appears | `qt_url` / `qt_key` not in config.json or env — no worker to route to |
| Extension doesn't poll | Open QuickTask popup → Settings → verify URL + key are saved |
| Jobs pushed but never processed | No paypal.com tab open — content scripts only run in-tab |
| Pay button never clicks | Selector changed — add to `findBtn()` in `quicktask-ext/content-paypal.js` |
| Cross-origin fetch blocked | Worker must return `Access-Control-Allow-Origin: *` (or echo `Origin`) on all `/pp/*` responses |
