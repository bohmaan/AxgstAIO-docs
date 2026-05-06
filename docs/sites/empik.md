# Empik

**Code:** `empik`
**Region:** Poland
**Modes:** `buy`, `register`
**Payment:** Card / BLIK / przelewy (manual handoff)
**Notes:** Cloudflare Turnstile on register and cart — requires CapSolver key.

## CSV row

```csv
empik;https://www.empik.com/example-product,p1234567890,prd;buy;1;;500;3;guest@example.com;;;John;Doe;+48123456789;Marszalkowska;100;Warszawa;00-001;mazowieckie;PL;;;
```


## Sample CSV

- [empik-buy.csv](/samples/empik-buy.csv)
- [empik-register.csv](/samples/empik-register.csv)

## Modes

- `buy` — monitor product, ATC, address + delivery, place order.
- `register` — create account with saved default address.
