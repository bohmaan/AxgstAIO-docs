# Queue-it (generic)

**Code:** `queueit` (alias `qit`)
**Region:** Any site behind Queue-it
**Modes:** `buy` (pass-only)
**Payment:** N/A
**Notes:** Helper for queue-protected sites. Passes the queue and hands off cookies — no checkout itself.

## CSV row

```csv
queueit;https://www.example.com/?queueit=1;buy;1;;9999;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```

## Modes

- `buy` — solve the Queue-it wait, return the unlocked session/cookies for downstream use.
