# AxgstAIO Documentation

Public documentation site for [AxgstAIO](https://github.com/bohmaan/AxgstAIO).

Live at: **https://bohmaan.github.io/AxgstAIO-docs/**

## Stack

- [VitePress](https://vitepress.dev/) — static-site generator
- GitHub Pages — hosting
- GitHub Actions — CI/CD

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173. Hot-reloads on Markdown edits.

## Build

```bash
npm run build
```

Output in `docs/.vitepress/dist`.

## Deploy

Automatic on every push to `main` via `.github/workflows/deploy.yml`.

**One-time setup** on the repo:

1. Go to **Settings → Pages** on GitHub.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow deploys automatically.

## Content structure

```
docs/
├─ index.md               # landing (hero + features)
├─ guide/
│   ├─ introduction.md
│   ├─ quick-start.md
│   ├─ installation.md
│   ├─ updating.md
│   ├─ csv-format.md
│   ├─ proxies.md
│   ├─ webhooks.md
│   ├─ accounts.md
│   ├─ running.md
│   ├─ buy.md
│   ├─ register.md
│   └─ troubleshooting.md
├─ sites/
│   ├─ index.md
│   ├─ zalando.md
│   ├─ sportsshoes.md
│   └─ ... (one .md per site)
├─ faq.md
├─ changelog.md
├─ public/
│   ├─ logo.svg
│   └─ favicon.svg
└─ .vitepress/
    ├─ config.ts          # nav, sidebar, theme
    └─ theme/
        ├─ index.ts
        └─ custom.css     # brand colors
```

## Editing

- Sidebar + nav: `docs/.vitepress/config.ts`
- Colors / theme: `docs/.vitepress/theme/custom.css`
- Logo: `docs/public/logo.svg`

Every page supports Markdown + frontmatter. See [VitePress docs](https://vitepress.dev/guide/markdown) for the full Markdown extensions (containers like `::: tip`, custom components, etc.).
