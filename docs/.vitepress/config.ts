import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AxgstAIO',
  description: 'AxgstAIO documentation',
  base: '/AxgstAIO-docs/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/AxgstAIO-docs/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00d084' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AxgstAIO',

    nav: [
      { text: 'Guide', link: '/guide/installation' },
      { text: 'Sites', link: '/sites/' },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Updating', link: '/guide/updating' },
          ],
        },
        {
          text: 'Configuration',
          items: [
            { text: 'Tasks CSV', link: '/guide/csv-format' },
            { text: 'Proxies', link: '/guide/proxies' },
            { text: 'Accounts & Sessions', link: '/guide/accounts' },
            { text: 'Telemetry & Webhooks', link: '/guide/telemetry' },
          ],
        },
        {
          text: 'Help',
          items: [
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/sites/': [
        {
          text: 'Sites',
          items: [
            { text: 'Overview', link: '/sites/' },
            { text: 'Alza (CZ / DE / AT / HU)', link: '/sites/alza' },
            { text: 'All4Running', link: '/sites/all4running' },
            { text: 'BasketballEmotion', link: '/sites/basketballemotion' },
            { text: 'Boozt', link: '/sites/boozt' },
            { text: 'Cardverse', link: '/sites/cardverse' },
            { text: 'CR7 Museum Store', link: '/sites/cr7' },
            { text: 'DiablesTCG', link: '/sites/diablestcg' },
            { text: 'Dragon World', link: '/sites/dragonworld' },
            { text: 'Dreamland', link: '/sites/dreamland' },
            { text: 'Elbenwald', link: '/sites/elbenwald' },
            { text: 'Empik', link: '/sites/empik' },
            { text: 'END. Clothing', link: '/sites/endclothing' },
            { text: 'Fantasiastore', link: '/sites/fantasiastore' },
            { text: 'Footshop', link: '/sites/footshop' },
            { text: 'FutbolEmotion', link: '/sites/futbolemotion' },
            { text: 'Frasers (Sports Direct, GAME UK, Flannels...)', link: '/sites/frasers' },
            { text: 'Games Island', link: '/sites/gamesisland' },
            { text: 'Gnom-Sklep', link: '/sites/gnomsklep' },
            { text: 'Intertoys', link: '/sites/intertoys' },
            { text: 'Mag Planszowy', link: '/sites/magplanszowy' },
            { text: 'Mediaexpert', link: '/sites/mediaexpert' },
            { text: 'MediaMarkt', link: '/sites/mediamarkt' },
            { text: 'MediaMarkt DE', link: '/sites/mediamarktde' },
            { text: 'MerchantPro', link: '/sites/merchantpro' },
            { text: 'MyComics', link: '/sites/mycomics' },
            { text: 'Proshop', link: '/sites/proshop' },
            { text: 'RAM Cards', link: '/sites/ramcards' },
            { text: 'Reflexshop', link: '/sites/reflexshop' },
            { text: 'Shoper (generic)', link: '/sites/shoper' },
            { text: 'Skatedeluxe', link: '/sites/skatedeluxe' },
            { text: 'Secret Lair', link: '/sites/secretlair' },
            { text: 'SK Store / WSS', link: '/sites/skstore' },
            { text: 'SportsShoes', link: '/sites/sportsshoes' },
            { text: 'Sportvision', link: '/sites/sportvision' },
            { text: 'Tantis', link: '/sites/tantis' },
            { text: 'Top1Toys', link: '/sites/top1toys' },
            { text: 'Top4Running', link: '/sites/top4running' },
            { text: 'Xzone (CZ / PL / DE / SK)', link: '/sites/xzone' },
            { text: 'Queue-it (generic)', link: '/sites/queueit' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bohmaan/HopAIO' },
    ],

    footer: {
      message: 'Private distribution.',
      copyright: '© 2026 AxgstAIO',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/bohmaan/AxgstAIO-docs/edit/main/docs/:path',
      text: 'Edit this page',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },
})
