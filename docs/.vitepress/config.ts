import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AxgstAIO',
  description: 'All-in-one checkout bot for European e-commerce sites',
  base: '/AxgstAIO-docs/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/AxgstAIO-docs/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00d084' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AxgstAIO Documentation' }],
    ['meta', { property: 'og:description', content: 'All-in-one checkout bot for European e-commerce sites' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AxgstAIO',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Sites', link: '/sites/' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Changelog', link: '/changelog' },
      {
        text: 'v1.2.1',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com/bohmaan/AxgstAIO' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is AxgstAIO?', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Updating', link: '/guide/updating' },
          ],
        },
        {
          text: 'Configuration',
          items: [
            { text: 'CSV Task Format', link: '/guide/csv-format' },
            { text: 'Proxies', link: '/guide/proxies' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Accounts & Sessions', link: '/guide/accounts' },
          ],
        },
        {
          text: 'Usage',
          items: [
            { text: 'Running tasks', link: '/guide/running' },
            { text: 'Buy mode', link: '/guide/buy' },
            { text: 'Register mode', link: '/guide/register' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/sites/': [
        {
          text: 'Supported sites',
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
      message: 'Released under a private license.',
      copyright: 'Copyright © 2026 AxgstAIO',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/bohmaan/AxgstAIO-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },
})
