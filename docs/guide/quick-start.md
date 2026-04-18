# Quick Start

Get your first checkout running in under 5 minutes.

## 1. Download the latest release

Go to the [releases page](https://github.com/bohmaan/AxgstAIO/releases) and download the most recent `axgstaio.exe`. Put it in its own folder — the bot will create `tasks/`, `proxy/`, and `sessions/` subfolders next to it.

## 2. Add a proxy file

Create `proxies.txt` in the same folder:

```
ip:port:user:pass
ip:port:user:pass
ip:port:user:pass
```

HTTP/HTTPS format. One proxy per line. The bot picks one per task. See [Proxies](/guide/proxies) for full options including SOCKS.

::: tip
If you leave `proxies.txt` empty, tasks run through your own IP. Fine for testing, bad for more than 1–2 tasks.
:::

## 3. Prepare a tasks CSV

Create `tasks.csv`:

```csv
site;url;mode;qty;max_price;delay_sec;email;password
zalando;https://www.zalando.cz/former-reynolds-kosile-pine-f8122d010-m11.html;buy;1;10000;3;your@email.com;YourPa55word
```

Columns explained on the [CSV format](/guide/csv-format) page. Semicolon delimiters work best — commas often appear inside URLs.

## 4. Run it

Double-click `axgstaio.exe`. You'll see:

```
==========================================
          AxgstAIO 1.2.1
==========================================

Loaded 150 proxies
  1 task(s) | 150 proxies
    #1: [zalando] [buy] https://... | qty=1 | max=10000.0 CZK

11:50:03 [Task 1] Restored session
11:50:04 [Task 1] Found: REYNOLDS Košile — 2 290,00 Kč
11:50:05 [Task 1] Size: M
11:50:06 [Task 1] Checking out...
11:50:13 [Task 1] Successful checkout (10.3s)
```

If you configured a webhook, you'll also get a Discord message with the product image and PayPal URL.

## 5. Open the PayPal link

PayPal URLs are posted only to webhooks (not to the terminal). Configure one — see [Webhooks](/guide/webhooks) — or check your proxy logs for the redirect.

## What next?

- Add more sites → [Sites overview](/sites/)
- Tune timings → [CSV format](/guide/csv-format)
- Enable auto-update → [Updating](/guide/updating)
- Something broke? → [Troubleshooting](/guide/troubleshooting)
