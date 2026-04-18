# Proxies

File: `proxies.txt` next to the exe. One proxy per line.

## Sample

📄 [proxies.txt](/samples/proxies.txt)

## Accepted formats

```
ip:port
ip:port:user:pass
http://user:pass@ip:port
socks5://user:pass@ip:port
```

Mixing formats in one file is fine.

## Assignment

One proxy per task, kept for the full lifecycle (login → checkout). Round-robin across the pool.

## Recommendations

- **Residential** for Zalando, SportsShoes login and all register flows.
- **Datacenter** is fine for Empik, Elbenwald, Mycomics.
- Avoid free / public proxies — flagged within minutes.

## No proxy

Leave `proxies.txt` empty or delete it. Tasks run on your local IP — useful only for testing.
