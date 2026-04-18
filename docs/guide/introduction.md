# What is AxgstAIO?

**AxgstAIO** is an all-in-one Windows desktop bot that automates the checkout flow on a curated list of European e-commerce sites. You load a CSV of tasks, point it at a proxy file, hit run, and the bot parallelizes every task — logging in, picking sizes, adding to cart, checking out, and posting the PayPal URL to your Discord webhook.

## What it does

| Action | Description |
|--------|-------------|
| **Buy** | Reads a product URL, picks a size (or waits for restock), adds to cart, runs the full native checkout, and returns a PayPal payment link. |
| **Register** | Creates a fresh account with a provided address, ready for buy tasks. |

## Who it's for

AxgstAIO is aimed at individual resellers, restock hunters, and automation tinkerers who want a single binary that handles many sites without juggling ten browser extensions.

It is **not** a scraper, not a price monitor, and not a reseller marketplace — it's a checkout automation tool.

## Supported sites

See the full list on the [Sites overview](/sites/) page. As of v1.2.1:

- **Zalando** (all European TLDs)
- **SportsShoes**
- **BasketballEmotion**
- **FutbolEmotion**
- **Empik**
- **Elbenwald**
- **FootDistrict**
- **Mycomics**
- **Sportvision**
- **Dfn**

## How it works (in 60 seconds)

1. You prepare a **tasks CSV** with one row per checkout attempt.
2. You drop a **proxies.txt** file next to the exe.
3. You run `axgstaio.exe`.
4. The launcher reads the CSV, picks a proxy per task, and spawns one worker per row.
5. Each worker runs the full site-specific flow: login → size probe → ATC → checkout → PayPal.
6. Discord webhooks notify you of successes and failures with the product name, price, size, and PayPal URL.

## Next steps

- [Quick Start](/guide/quick-start) — get your first task running in 5 minutes.
- [CSV format](/guide/csv-format) — understand the task file.
- [Per-site guides](/sites/) — site-specific notes and quirks.
