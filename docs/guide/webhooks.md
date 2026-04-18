# Webhooks

Discord webhooks deliver the PayPal URL, product image, size, and task outcome to your channel. Every task posts one message on success and one on failure.

## Setup

1. In Discord, open your server → **Channel Settings → Integrations → Webhooks**.
2. Click **New Webhook**, give it a name, copy the URL.
3. Paste the URL into the `webhook` column of your tasks CSV.

## CSV column

```csv
site;url;...;webhook
zalando;...;https://discord.com/api/webhooks/1234567890/abcdef...
```

Each row can have its own webhook. Leave empty to silence a row.

## What gets posted

### Successful checkout

- Title: `AxgstAIO — Checkout successful`
- Product name
- Price
- Product image
- Size selected
- **PayPal URL** (click & pay on your phone)
- Footer: site label

### Failed checkout

- Title: `AxgstAIO — Checkout failed`
- Product name
- Price
- Size attempted
- Failure reason
- Footer: site label

### Raffle entered

- Title: `AxgstAIO — Raffle entered` (for register + raffle sites)
- Account email
- Footer: site label

## Webhook rate limit

Discord webhooks accept ~5 messages per second. At very high task counts (50+) you may see throttling. The bot has no built-in queue — messages beyond the limit will be dropped silently.

## Sharing a webhook across tasks

Point every CSV row to the same webhook URL. Practical if you want a single `#buys` channel.

## Multiple webhooks

Use different URLs per row to route Zalando to `#zalando`, SportsShoes to `#sports`, etc.
