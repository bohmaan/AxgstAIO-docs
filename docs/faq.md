# FAQ

## macOS / Linux support?

Windows-only binary. Source runs on any OS with Python 3.11+ and `curl_cffi`, but auto-update is Windows-only.

## Can I run on a VPS?

Any Windows VPS works. 2 vCPU, 4 GB RAM, low-latency EU location (Frankfurt, Amsterdam) recommended.

## Max concurrency?

Soft-limited by RAM and proxy pool size. 50 tasks on 150 proxies is comfortable. 200+ can OOM a modest VPS.

## Where are logs?

Not written to disk by default. Pipe stdout:

```cmd
axgstaio.exe > run.log 2>&1
```

## Adding a new site?

Open a GitHub issue with:

- Site URL
- Example product page
- Whether it uses Akamai / DataDome / PerimeterX
- Captcha type if any

Standard Shopify / Magento / public REST APIs are quick to add. DataDome / PerimeterX sites generally aren't.
