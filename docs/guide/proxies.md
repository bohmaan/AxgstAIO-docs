# Proxies

AxgstAIO rotates proxies per-task. Every worker gets one proxy from `proxies.txt` and uses it for the entire task lifecycle (login, ATC, checkout).

## File location

`proxies.txt` next to the `.exe`. One proxy per line.

## Accepted formats

| Format | Example |
|--------|---------|
| `ip:port` | `1.2.3.4:8080` |
| `ip:port:user:pass` | `1.2.3.4:8080:myuser:mypass` |
| `http://user:pass@ip:port` | `http://myuser:mypass@1.2.3.4:8080` |
| `socks5://user:pass@ip:port` | `socks5://u:p@1.2.3.4:1080` |

The parser auto-detects. Mixing formats in one file is fine.

## Rotation strategy

- **Per task, not per request.** A single task keeps one proxy end-to-end — critical for session consistency (Akamai, CloudFlare ties cookies to IP).
- **Round-robin across the proxy list.** If you have 150 proxies and 8 tasks, each task gets a unique proxy.
- **No automatic retry on a different proxy.** If a proxy fails (403, timeout), the task fails. Relaunch to try again.

## Recommended proxy types

| Use case | Type | Why |
|----------|------|-----|
| Zalando, SportsShoes login | **Residential** | Akamai flags datacenter IPs as `elevated-risk-score` |
| Register flows | **Residential**, preferably ISP | Low risk-score required |
| Empik, Elbenwald buy | Datacenter (fast rotation) OK | Less aggressive bot detection |
| FutbolEmotion, BasketballEmotion | Either works | Custom anti-bot, not Akamai |

## Known issues

### All tasks return `Login failed — Akamai halt`

Your proxies are flagged. Options:

1. Switch to residential proxies (Bright Data, Oxylabs, Smartproxy, Webshare residential).
2. Wait 30–60 minutes — IP reputation sometimes recovers.
3. Reduce concurrency: launch 1 task every 5s instead of 8 at once.

### `Login failed — 403` but other tasks succeed

Specific proxy is burnt. Remove it from `proxies.txt` or let the launcher skip it (future feature).

### Proxy file not loaded

Check launcher output for `Loaded X proxies`. If it says `Loaded 0 proxies`, the file is empty, misnamed, or all lines failed to parse. Look for leading/trailing spaces and BOM characters.

## No proxy (direct connection)

Leave `proxies.txt` empty or delete it. All tasks run on your local IP. Useful for testing but you'll be rate-limited fast on Zalando and Akamai-protected sites.
