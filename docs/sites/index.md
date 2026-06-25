# Sites & Modules

All supported shops and the modes each module accepts. Set the shop via the
**`site`** column value (any alias works) and the flow via the **`mode`** column
(CSV `mode` field; blank = `buy`). Click a site for its CSV row example.

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
| [Gnom-Sklep](/sites/gnomsklep) | `gnomsklep` / `gnom` | PL | buy |
| [Tantis](/sites/tantis) | `tantis` | PL + EU lockers | buy · pickup |
| [DiablesTCG](/sites/diablestcg) | `diablestcg` | PL / IT | buy |
| [Mag Planszowy](/sites/magplanszowy) | `magplanszowy` / `magplan` | PL | buy · pickup |
| [Shoper (generic)](/sites/shoper) | `shoper` | PL (any Shoper shop) | buy · pickup |
| [SK Store / WSS](/sites/skstore) | `skstore` / `sk` / `wss` | PL / EU | buy |

## Netherlands / Toys 🇳🇱

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Dreamland](/sites/dreamland) | `dreamland` / `dl` | NL / BE | buy · preload |
| [Top1Toys](/sites/top1toys) | `top1toys` / `t1t` | NL | buy · preload |
| [Intertoys](/sites/intertoys) | `intertoys` / `it` | NL | buy · preload |
| [MediaMarkt](/sites/mediamarkt) | `mediamarkt` / `mm` | NL | buy · register · login · preload |
| [MediaMarkt DE](/sites/mediamarktde) | `mediamarkt.de` / `mmde` | DE | buy · register · login · preload |

## Germany / EU 🇩🇪

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Elbenwald](/sites/elbenwald) | `elbenwald` / `ew` | DE / EU | buy · register · login · force |
| [Skatedeluxe](/sites/skatedeluxe) | `skatedeluxe` / `sd` | DE / EU | buy · register |
| [Footshop](/sites/footshop) | `footshop` / `fs` | CZ / EU | buy · register · pickup |
| [Games Island](/sites/gamesisland) | `gamesisland` / `gi` | DE / EU | buy · register · login |
| [Boozt](/sites/boozt) | `boozt` | DE / EU / CZ / IT | buy · preload |
| [Top4Running](/sites/top4running) | `top4running` / `t4r` | DE / EU | buy · register · preload |
| [All4Running](/sites/all4running) | `all4running` / `a4r` / `21run` | NL / EU | buy · preload |

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

## UK / EU 🇬🇧

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [SportsShoes](/sites/sportsshoes) | `sportsshoes` / `ss` | UK / EU | buy · register · preload |
| [END. Clothing](/sites/endclothing) | `endclothing` / `end` | UK / EU | buy · register · login · preload |
| [Frasers (Sports Direct, GAME, Flannels…)](/sites/frasers) | `game` / `sportsdirect` / `flannels` / `studio` / `houseoffraser` / `usc` / `everlast` | UK / EU | buy |

## Hungary / Romania / TCG & games

| Site | Codes | Region | Modes |
|------|-------|--------|-------|
| [Reflexshop](/sites/reflexshop) | `reflexshop` / `rs` | HU | buy · register |
| [Cardverse](/sites/cardverse) | `cardverse` / `cv` | HU | buy |
| [RAM Cards](/sites/ramcards) | `ramcards` / `rc` | RO | buy |
| [CR7 Museum Store](/sites/cr7) | `cr7` | EU | buy |
| [Dragon World](/sites/dragonworld) | `dragonworld` / `dw` | EU | buy |
| [Secret Lair](/sites/secretlair) | `secretlair` / `sl` | EU | buy · register |

## Generic platforms

| Platform | Codes | Region | Modes |
|----------|-------|--------|-------|
| [Shoper (any PL Shoper shop)](/sites/shoper) | `shoper` | PL | buy · pickup |
| [MerchantPro (e.g. thepokemania)](/sites/merchantpro) | `merchantpro` / `thepokemania` | RO / EU | buy |
| [Queue-it (generic)](/sites/queueit) | `queueit` / `qit` | any | pass |

::: tip Pickup / locker shops
For locker delivery put the pickup-point code in the **`discount`** column
(e.g. Tantis: `SVA01M` for a PL InPost Paczkomat, or `ITFAN043743D` for an
InPost International locker in Fano, Italy — the brand/shipping is auto-detected).
:::
