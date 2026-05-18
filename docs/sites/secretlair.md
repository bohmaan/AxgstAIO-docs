# Secret Lair

**Code:** `secretlair` (aliases `sl`, `secretlair.wizards.com`)
**Region:** EU
**Modes:** `register`, `login`
**Payment:** PayPal — cart-hold handoff (pay link sent to your webhook)
**Notes:** No guest checkout. Account required (register or login). Drops sit behind Queue-it — the bot rides the queue automatically.

Secret Lair (`secretlair.wizards.com`) runs on the Scalefast "Pepita"
platform. The whole flow is pure HTTP — token mint, account, cart, queue
and the PayPal hold are all API calls, no browser is opened.

## How a buy runs

1. **Auth** — `register` creates the account then logs in; `login` uses
   an existing account. App token + user token are minted against the
   Scalefast OAuth endpoint. Intermittent CloudFront `403`s on flagged
   proxy IPs are handled automatically: the bot rerolls its TLS
   fingerprint and, if needed, retries directly without the proxy.
2. **Queue-it** — drops are gated. The bot fetches the signed queue
   token transparently and carries it into the order. No pass link to
   click.
3. **Cart + address** — product is added, your address is attached.
4. **PayPal hold** — Secret Lair's PayPal path is a *cart hold*, not a
   card charge. The bot does **not** handle a card or 3DS. It produces
   the PayPal approval link and **sends it to your webhook**. You open
   that link and approve the payment to finish the order. The browser is
   never opened by the bot.

::: tip Webhook
You get exactly **one** private webhook (full payload, with the PayPal
link) and the public success webhook. Configure your webhook in the bot
settings — see [Telemetry & Webhooks](/guide/telemetry).
:::

## CSV row

`register` (creates the account, then is ready for the drop):

```csv
secretlair;https://www.secretlair.wizards.com/product/example;register;1;;500;3;you@example.com;P4ss!;;Jan;Novak;+420777888999;Konevova;135;Praha;13000;;CZ;;;
```

`login` (account already exists):

```csv
secretlair;https://www.secretlair.wizards.com/product/example;login;1;;500;3;you@example.com;P4ss!;;;;;;;;;;CZ;;;
```

## Sample CSV

- [secretlair-register.csv](/samples/secretlair-register.csv)
- [secretlair-login.csv](/samples/secretlair-login.csv)

## Modes

- `register` — create the account, mint tokens, then ride the queue →
  cart → PayPal hold link to webhook.
- `login` — same as above using an existing account (no registration
  step). Address columns optional if the account already has one.

## Notes

- **No guest checkout** — `buy` without an account is not supported.
  Use `register` or `login`.
- **PayPal only** — there is no automated card path here by design; the
  store's flow is a PayPal hold. The bot's job ends at delivering the
  approval link.
- **Queue-it** is automatic — you do not need a separate `queueit` task.
- `max_price` still applies; the task aborts if the cart total exceeds
  it before the hold is created.
