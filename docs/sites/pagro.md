# Pagro

**Code:** `pagro` / `pg`

## Region

Austria. Ships AT primary.

## Sample CSVs

<div class="download-box">

- 📄 [pagro-buy.csv](/samples/pagro-buy.csv)
- 📄 [pagro-register.csv](/samples/pagro-register.csv)

</div>

## Buy row

```csv
pg;https://www.pagro.at/<product-slug>.html;buy;1;100;3;you@mail.at;YourPassword;AT
```

ATC then posts the cart link to the webhook — open it in a real browser to finish checkout.

OOS retry loop — the bot keeps retrying ATC at the CSV `delay` interval, refetching the PDP each time so live restocks during a drop are picked up automatically.

## Register row

```csv
pg;;register;1;0;0;new@mail.at;NewP4ss;AT;Hans;Mueller
```

Pure HTTP register — no captcha. Address is added later through the user account, not at signup.

## Cloudflare

The site is gated by Cloudflare. The bot solves the challenge once per task using a real headless Chrome (patchright preferred, playwright fallback) and reuses the clearance for the rest of the run.

A global cap of **5 concurrent CF solves** keeps small VPS hosts from being overwhelmed by a large fleet. Tasks past the limit wait their turn — they don't fail.

::: tip Requirement
`pip install patchright && patchright install chromium` (or `playwright install chromium`).
:::

## Known issues

- No size/option support — Pagro listings are simple SKUs without configurable variants.
- Limited-edition drops with their own queue would need a separate module — Pagro doesn't currently use Queue-it.
