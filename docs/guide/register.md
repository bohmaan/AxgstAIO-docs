# Register mode

Creates a fresh account on a site, optionally with a saved delivery address. Useful for farming accounts before a drop, or for sites that require a new account per purchase.

## CSV row

```csv
site;url;mode;qty;max_price;delay_sec;email;password;first_name;last_name;street;building_number;postal_code;city;country_code;phone;webhook
zalando;;register;1;0;0;new@mail.com;NewP4ssword!;Jan;Novák;Koněvova;135;13000;Praha;CZ;+420777888999;<discord url>
```

- `url` is empty for register tasks (no product needed).
- All address fields are optional but recommended — most sites block checkout without a default delivery address.

## What happens

1. **username-lookup** — checks if the email is free. Aborts if already registered.
2. **Create account** — POST to the site's registration endpoint with email + password + TOC consent.
3. **(Optional) Add address** — site-specific; some flows submit address during registration, others require a separate API call.
4. **Verify login** — immediately logs in to confirm credentials work and to cache cookies.
5. **Webhook** — posts the result.

## Per-site notes

### Zalando
- Uses mobile Android SSO flow (`fashion-store-mobile-android`).
- Requires proxy with clean IP reputation; otherwise returns `403 elevated-risk-score`.
- Address is submitted as part of the register body.

### SportsShoes
- reCAPTCHA v3 — solved automatically via an embedded captcha provider key.
- Address is saved during checkout, not registration.

### BasketballEmotion / FutbolEmotion
- Custom Empathy platform — no captcha.
- Address added via a separate post-registration API call.

See [Sites](/sites/) for full per-site details.

## Best practices

- **Use fresh residential proxies.** Datacenter IPs get flagged instantly on Zalando, SportsShoes.
- **Generate realistic names.** Avoid "test test" or "aaa bbb" — some sites flag this.
- **Use mailinator/temp-mail only for throwaway testing.** Production-worthy accounts need real inboxes for OTP verification.
- **Stagger registrations.** Don't register 20 accounts in 30 seconds from the same IP pool.

## Output

```
09:01:14 [Task 1] Successful registration (4.2s)
```

Or:

```
09:01:15 [Task 1] Register failed — email already registered (0.9s)
09:01:17 [Task 2] Register failed — 403 (1.1s)
```
