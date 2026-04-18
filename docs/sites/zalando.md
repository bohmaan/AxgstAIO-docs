# Zalando

Zalando runs a modern OAuth2 + GraphQL stack behind Akamai. AxgstAIO uses a hybrid flow: **web** login (stable) + **native GraphQL** ATC + **trampoline** checkout.

## CSV code

`zalando` or `zal`

## Supported regions

Detected from the URL TLD automatically. CSV `country_code` is used only if the URL is empty (register tasks).

| TLD | Country | Domain |
|-----|---------|--------|
| `.cz` | CZ | www.zalando.cz |
| `.de` | DE | www.zalando.de |
| `.pl` | PL | www.zalando.pl |
| `.at` | AT | www.zalando.at |
| `.fr` | FR | www.zalando.fr |
| `.es` | ES | www.zalando.es |
| `.co.uk` | GB | www.zalando.co.uk |
| `.nl` | NL | www.zalando.nl |
| `.sk` | SK | www.zalando.sk |
| `.it` | IT | www.zalando.it |

## Login flow

`fashion-store-web` OAuth2 client on `accounts.zalando.com`.

1. `GET /login` on the shop domain — sets `csrf-token` and `Zalando-Client-Id` cookies.
2. `POST /api/sso/username-lookup`
3. `POST /api/sso/credentials-check`
4. `POST /api/sso/authentications/credentials` with `authentication_request = {client_id, request_id, redirect_uri, response_type, scope, nonce, state, ui_locales, tc}`
5. Follow `redirect_url` → `zsso`, `zac` cookies are set directly in the web session.

::: warning Register uses mobile flow
The register path uses `fashion-store-mobile-android` (PKCE, `de.zalando.mobile://zalando/auth` redirect URI). Server-side risk score for registration is aggressive — **residential proxies mandatory**.
:::

## Buy flow

1. **get_product** — GraphQL query returns name, price, image. Same session as login.
2. **clear_cart** — removes any prior items from DraftOrder + bag.
3. **probe_sizes** — batch ATC of all letter/numeric variants via `addToCart` mutation, then read DraftOrder `groups` to see which actually landed (not `out_of_stock_articles`).
4. **ATC** — keeps the selected SKU in the DraftOrder.
5. **Trampoline** — `GET /checkout/v3/fetch-or-create-checkout-trampoline?checkout_variant=PHYSICAL`. Follows redirects, reads `checkout_contract_id` from the final URL.
6. **Checkout state + payment HTML** in parallel — GQL state for address check + HTML page for `session_id` / JWT.
7. **Select PayPal** — `POST purchase-session.client-api.payment.zalando.com/sessions/{id}/checkout/payment?payment_method_id=paypal`.
8. **Refetch version** — checkout version changes after PayPal select.
9. **Place order** — `placeCheckoutOrder` GraphQL mutation. Returns PayPal redirect URL.

## Timings

Typical end-to-end from cold cache to PayPal URL:

| Stage | Seconds |
|-------|---------|
| Login (cold) | 3–5 |
| Login (cached session) | <1 |
| Product + clear cart | 1 |
| Probe sizes | 2 |
| ATC | <1 |
| Trampoline + checkout state | 7–9 |
| PayPal select | 8–10 |
| Place order | 2–3 |
| **Total** | **20–30s cold, 12–15s warm** |

## Known issues

- **`Login failed — Akamai halt`** — proxy IP reputation is poor. Use residential proxies.
- **`Login failed — 403 elevated-risk-score`** — harder bot-detection hit. Same fix.
- **`Checkout failed — no saved address`** — register first with `first_name`, `street`, `postal_code`, `city` columns set, or add the address via the Zalando website.
- **`place-order.order-token-expired`** — transient, retry. v1.2.0+ refetches version before placing.

## Register notes

- Mobile PKCE OAuth flow: `de.zalando.mobile://zalando/auth` redirect URI, `scope=openid`.
- Requires a clean `Zalando-Client-Id` cookie — bot does the full `/oauth2/authorize` warm-up hit.
- Registration body includes `authentication_request: {client_id, request_id, redirect_uri, ui_locales, tc}` — same shape as the web SPA posts.
- Proxy with **clean** IP reputation required. Datacenter IPs fail instantly with `elevated-risk-score`.

## Recommended CSV row (buy)

```csv
zalando;https://www.zalando.cz/former-reynolds-kosile-pine-f8122d010-m11.html;buy;1;3000;3;you@email.com;YourP4ss;M,L;CZ;<webhook>
```

## Recommended CSV row (register)

```csv
zalando;;register;1;0;0;new@email.com;NewP4ss!;Jan;Novák;Koněvova;135;13000;Praha;CZ;+420777888999;<webhook>
```
