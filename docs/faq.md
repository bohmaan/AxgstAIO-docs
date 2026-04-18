# FAQ

## Does AxgstAIO need a browser?

No. It's pure HTTP + parsed responses. No headless Chrome, no Puppeteer. This makes it fast (~10x faster than browser-based bots) but also means sites with heavy JS-based anti-bot (DataDome, PerimeterX) may not work.

## Does it need Python installed?

No. The release binary bundles Python 3.14 via PyInstaller. Double-click and go.

## Can I run it on macOS / Linux?

Not officially. The exe is Windows-only. You can run the source code (`.py` files) on any OS if you install Python 3.11+ and `curl_cffi`, but auto-update is Windows-only.

## Are my accounts safe?

The bot does not exfiltrate credentials anywhere. Sessions are stored locally in `sessions/` as JSON cookie jars. **Do not share the folder** — anyone with it can impersonate your accounts on those sites.

## Is this legal?

Using automation to check out faster is a gray area and violates most sites' terms of service. You may be rate-limited or banned. Use at your own risk. This tool is provided for educational and personal-convenience purposes.

## Can I checkout more than 1 item?

The `qty` column exists but most sites only respect 1. If you need multiple of the same product, add multiple CSV rows with different accounts.

## Why does it skip directly to PayPal — no card option?

Because card auth often requires 3DS which would lock the bot in a manual challenge. PayPal's mobile flow is 1-tap from your phone. If the site supports PayPal, the bot uses it; otherwise it fails.

## Can I run it on a VPS?

Yes, any Windows VPS works. Recommended: 2 vCPU, 4 GB RAM, low-latency location (Frankfurt / Amsterdam for EU sites).

## How many tasks can I run in parallel?

Soft limit is your RAM / proxy pool. 50 tasks on a 150-proxy pool is comfortable. 200+ tasks on a modest VPS will OOM.

## Why do I get `Akamai halt` on login?

Your proxy IPs have bad reputation. Switch to residential proxies — see [Proxies](/guide/proxies).

## Why does checkout take 20+ seconds?

Server-side latency on Zalando, SportsShoes, etc. The bot makes no unnecessary calls; the bottleneck is Zalando's checkout service (trampoline, payment select) which is slow by design. See [Zalando timings](/sites/zalando#timings).

## Does it work for Yeezy / SNKRS / FLX / Trapstar drops?

No. Those sites have aggressive bot detection (Akamai + DataDome + CloudFlare) and require browser-based solutions with CAPTCHA farms. Out of scope.

## How do I add my own site?

Open a feature request on [GitHub](https://github.com/bohmaan/AxgstAIO/issues) with:
- Site URL
- Example product page
- Whether it has Akamai, DataDome, or PerimeterX
- Whether it has reCAPTCHA / hCaptcha

Sites with standard Shopify / Magento / public REST APIs are quick to add.

## Where are the logs?

Not written to disk by default. Pipe stdout to a file if you want a permanent log:

```cmd
axgstaio.exe > run.log 2>&1
```

## Can I request features?

Yes — GitHub issues. PR welcome.
