# Accounts & Sessions

Every buy task logs in with an email + password from the CSV. The bot persists cookies per account in `sessions/`, so subsequent tasks skip the login entirely.

## How sessions are stored

```
sessions\
├─ zalando_a3f4b2.json      # hashed email, per site
├─ sportsshoes_c9d8e1.json
└─ be_1234ab.json
```

Filenames use a short hash of the email so they don't leak account addresses if you share the folder.

## Lifecycle

1. **First run** — bot does the full login, saves the cookie jar.
2. **Subsequent runs** — loads cookies, sends a cheap authentication-check request.
   - If the server accepts → prints `Restored session`, skips login.
   - If the server rejects (expired) → deletes the cache, does a fresh login.

## When to clear sessions

| Situation | Action |
|-----------|--------|
| Account password changed | Delete `sessions/<site>_<hash>.json` |
| Account locked / 2FA triggered | Delete + log into the site manually once, then re-run |
| You want a "clean" run for debugging | Delete all of `sessions/` |

Safe to delete the whole `sessions/` folder at any time. The next run rebuilds.

## Multiple accounts

One row per account in the CSV. Each gets its own cookie jar. No config needed — hashing keeps them separate.

## Account rotation

The launcher does **not** rotate accounts automatically. If you want the same product bought across 10 accounts, add 10 CSV rows with the same URL and different emails.

## Sharing the bot folder

The `sessions/` folder contains **logged-in session cookies**. Anyone with the folder can impersonate your accounts on those sites. Do not share or commit.

::: danger Do not commit `sessions/`
Add to `.gitignore` if you version your config:
```
sessions/
proxies.txt
*.csv
```
:::
