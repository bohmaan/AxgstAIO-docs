# Accounts & Sessions

Cookies are persisted per account in `sessions/` next to the exe. Each file is keyed by a hash of the email.

## Lifecycle

- **First run** — full login, cookies saved.
- **Subsequent runs** — cookies loaded and validated. If the server rejects (expired), the bot logs in again.

## When to clear

| Situation | Action |
|-----------|--------|
| Password changed on the site | Delete `sessions/<site>_<hash>.json` |
| Account locked / 2FA triggered | Delete the file, log in manually once, re-run |
| Clean slate for debugging | Delete the whole `sessions/` folder |

## Security

The `sessions/` folder contains **live logged-in cookies**. Anyone with the folder can impersonate your accounts on the affected sites. Do not share, back up to public clouds, or commit.
