# Running tasks

Running the bot is a single action: double-click `axgstaio.exe`. This page covers what happens under the hood and how to control it.

## Launch sequence

1. **Banner** — prints `AxgstAIO <version>` and checks for updates.
2. **Load proxies** — reads `proxies.txt`, prints `Loaded X proxies`.
3. **Load tasks** — reads `tasks.csv`, auto-detects delimiter, shows a preview.
4. **Confirm** — some builds prompt `Run all X tasks? [Enter]`. Press Enter to start.
5. **Parallel execution** — each task spawns a worker thread.
6. **Summary** — when all workers finish, launcher prints `All tasks finished. Press Enter to exit.`

## Parallel execution model

- Each task is its own Python thread.
- Each thread has its own **session** (cookies, proxy, TLS fingerprint).
- Threads do **not** share carts or account state.
- I/O is non-blocking (`curl_cffi` + async where helpful), so CPU stays low.

## Concurrency tuning

There's no explicit `max_workers` flag — every row in the CSV spawns one worker immediately. If you want to stagger launches:

- Split the CSV into multiple files and launch sequentially, OR
- Add `delay_sec` per row (this governs size-probe frequency, not launch delay — workaround only).

## Output

| Color | Meaning |
|-------|---------|
| **Green** | Successful step (login, ATC, checkout) |
| **Yellow** | Retryable warning (waiting for restock, Akamai halt) |
| **Red** | Hard failure (task aborted) |
| **Dim** | Progress indicator |

The bot does **not** print the PayPal URL to the console (see [Webhooks](/guide/webhooks)). Configure a webhook to get the link.

## Stopping mid-run

Press **Ctrl+C** in the console. Active HTTP requests complete before the worker exits — no partial checkouts.

## Logs & debugging

No logs are written to disk by default. To capture a run:

```cmd
axgstaio.exe > run-2026-04-18.log 2>&1
```

For more verbose output, there's no debug flag in release builds — but most errors print the HTTP status + body snippet.

## Restarting after a failure

Just relaunch. Because sessions are cached, accounts that already logged in will skip login and re-use cookies. Dead sessions are detected and refreshed.
