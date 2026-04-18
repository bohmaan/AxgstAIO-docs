# Troubleshooting

## Login

### `Login failed — Akamai halt`

Proxy IP reputation is flagged. Switch to residential, or wait 30–60 min.

### `Login failed — 403 elevated-risk-score`

Same cause. Residential proxies with clean IPs fix it.

### `Login failed — 401 Xsrf validation failed`

CSRF cookie wasn't set during warm-up. Usually means the proxy blocked the `/login` GET. Try a different proxy.

### `Saved cookies expired` on every run

`sessions/` folder isn't writable. Move the exe to a user-writable location.

## Checkout

### `Checkout failed — no saved address`

Account has no default delivery address. Register with address columns, or add it once via the site UI and delete the session cache to pick it up.

### `Checkout failed — order-token-expired`

Transient — retry. Fixed permanently in v1.2.0+.

### `Payment session/token not found`

Cart was empty at checkout (ATC failed silently). Check the preceding ATC step.

### `Order problem: <code>`

| Code | Meaning |
|------|---------|
| `place-order.order-token-expired` | Stale session — retry |
| `place-order.inventory-reserved-by-others` | OOS between ATC and place-order |
| `place-order.payment-method-invalid` | PayPal not available for this item/country |
| `place-order.address-invalid` | Saved address is malformed |

## Launcher

### Exits immediately with no output

CSV parse error swallowed by the exe. Run from PowerShell so the error stays visible:

```powershell
cd C:\Users\<you>\Desktop\AxgstAIO
.\axgstaio.exe
```

### `Update failed: HTTP 403`

GitHub API rate-limit. Wait an hour or download manually.
