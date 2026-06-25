# Sites & Modules

All supported shops and the modes each module accepts. Set the shop via the
**`site`** column value (any alias works) and the flow via the **`mode`** column
(CSV `mode` field; blank = `buy`).

## Mode legend

| Mode | What it does |
|------|--------------|
| `buy` | Default. Add to cart → checkout → place order / payment handoff. |
| `register` | Create a fresh account (often email-activated via IMAP). |
| `login` | Log into an existing account / refresh session. |
| `preload` | Warm the session + hold cart/stock before a drop. |
| `pay` | Pay an existing unpaid order (no re-cart). |
| `cancel` | Cancel existing order(s). |
| `pickup` | Ship to a parcel locker / pickup point instead of a home address. |
| `force` | Buy exactly the requested qty, no auto-downgrade. |
| `pass` | Queue-it: solve/pass the waiting room only. |
| `app` | Use the mobile-app API path instead of web. |

## Poland 🇵🇱

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Mediaexpert](/sites/mediaexpert) | `mediaexpert` / `me` | PL | buy · register · login · preload |
| [Empik](/sites/empik) | `empik` | PL | buy · register · pay · cancel · force · app |
| Gnom-Sklep | `gnomsklep` / `gnom` / `gnom-sklep.pl` | PL | buy (InPost Kurier + card/IdoPay) |
| **Tantis** | `tantis` / `tantis.pl` | PL + EU lockers | buy (InPost Kurier) · **pickup** (InPost Paczkomat; **InPost International** IT/ES/FR/BE/LU/NL/PT) |
| DiablesTCG | `diablestcg` / `diablestcg.pl` | PL / IT | buy (Shoper JSON API, card via Autopay) |
| Mag Planszowy | `magplanszowy` / `magplan` | PL | buy · pickup (InPost Kurier / Paczkomat) |
| Shoper (generic) | `shoper` | PL (any Shoper shop) | buy · pickup (locker / paczkomat) |
| [SK Store / WSS](/sites/skstore) | `skstore` / `sk` / `wss` | PL / EU | buy |

## Netherlands / Toys 🇳🇱

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| Dreamland | `dreamland` / `dl` | NL / BE | buy · preload |
| Top1Toys | `top1toys` / `t1t` | NL | buy · preload |
| Intertoys | `intertoys` / `it` | NL | buy · preload |
| MediaMarkt | `mediamarkt` / `mm` | NL | buy · register · login · preload |
| MediaMarkt DE | `mediamarkt.de` / `mmde` | DE | buy · register · login · preload |

## Germany / EU sneakers & lifestyle 🇩🇪

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Elbenwald](/sites/elbenwald) | `elbenwald` / `ew` | DE / EU | buy · register · login · force |
| [Skatedeluxe](/sites/skatedeluxe) | `skatedeluxe` / `sd` | DE / EU | buy · register |
| [Footshop](/sites/footshop) | `footshop` / `fs` | CZ / EU | buy · register · pickup |
| [Games Island](/sites/gamesisland) | `gamesisland` / `gi` | DE / EU | buy · register · login |
| Boozt | `boozt` / `boozt.com` / `boozt.de` | DE / EU / CZ / IT | buy · preload |
| Top4Running | `top4running` / `t4r` / `top4` | DE / EU | buy · register · preload |
| All4Running | `all4running` / `a4r` / `21run` | NL / EU | buy · preload |

## Italy 🇮🇹

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [MyComics](/sites/mycomics) | `mycomics` / `mc` | IT | buy |
| [Fantasiastore](/sites/fantasiastore) | `fantasiastore` / `fa` | IT | buy · register · login |

## Spain / EU 🇪🇸

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [BasketballEmotion](/sites/basketballemotion) | `basketballemotion` / `be` | ES / EU | buy · register |
| [FutbolEmotion](/sites/futbolemotion) | `futbolemotion` / `fe` | ES / EU | buy · register |

## Czech / Slovak 🇨🇿

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Alza](/sites/alza) | `alza` / `alza.cz` / `alza.de` / `alza.at` / `alza.hu` | CZ / DE / AT / HU | buy |
| [Sportvision](/sites/sportvision) | `sportvision` / `sv` | CZ | buy |
| [Xzone](/sites/xzone) | `xzone` / `xz` | CZ / PL / DE / SK | buy |
| [Zalando](/sites/zalando) | `zalando` / `zal` | EU | buy · register |

## UK / EU 🇬🇧

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [SportsShoes](/sites/sportsshoes) | `sportsshoes` / `ss` | UK / EU | buy · register · preload |
| [END. Clothing](/sites/endclothing) | `endclothing` / `end` | UK / EU | buy · register · login · preload |
| [Frasers (Sports Direct, GAME, Flannels…)](/sites/frasers) | `game` / `sportsdirect` / `flannels` / `studio` / `houseoffraser` / `usc` / `everlast` | UK / EU | buy |

## Hungary / Romania / TCG & games

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| Reflexshop | `reflexshop` / `rs` | HU | buy · register |
| Cardverse | `cardverse` / `cv` | HU | buy |
| RAM Cards | `ramcards` / `rc` | RO | buy (EasyPay pay link) |
| CR7 Museum Store | `cr7` | EU | buy (EasyPay pay link) |
| Dragon World | `dragonworld` / `dw` / `dragon-world.store` | EU | buy |
| [Secret Lair](/sites/secretlair) | `secretlair` / `sl` | EU | buy (PayPal hold) · register |

## Generic platforms

| Platform | Codes | Region | Modes |
|----------|-------|--------|-------|
| Shoper (any PL Shoper shop) | `shoper` | PL | buy · pickup |
| MerchantPro (e.g. thepokemania) | `merchantpro` / `thepokemania` | RO / EU | buy (Netopia pay link) |
| [Queue-it (generic)](/sites/queueit) | `queueit` / `qit` | any | pass |

::: tip Pickup / locker shops
For locker delivery put the pickup-point code in the **`discount`** column
(e.g. Tantis: `SVA01M` for a PL InPost Paczkomat, or `ITFAN043743D` for an
InPost International locker in Fano, Italy — the brand/shipping is auto-detected).
:::
