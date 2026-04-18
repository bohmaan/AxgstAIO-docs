import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AxgstAIO',
  description: 'AxgstAIO documentation',
  base: '/AxgstAIO-docs/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

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
            { text: 'Zalando', link: '/sites/zalando' },
            { text: 'SportsShoes', link: '/sites/sportsshoes' },
            { text: 'BasketballEmotion', link: '/sites/basketballemotion' },
            { text: 'FutbolEmotion', link: '/sites/futbolemotion' },
            { text: 'Empik', link: '/sites/empik' },
            { text: 'Elbenwald', link: '/sites/elbenwald' },
            { text: 'FootDistrict', link: '/sites/footdistrict' },
            { text: 'Mycomics', link: '/sites/mycomics' },
            { text: 'Sportvision', link: '/sites/sportvision' },
            { text: 'Dfn', link: '/sites/dfn' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bohmaan/AxgstAIO' },
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
