// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Clever Volt Docs',
  favicon: 'img/favicon.ico',

  // Set the production URL of your site here
  url: 'https://docs.clever-volt.com', // Your Firebase Hosting custom domain
  baseUrl: '/',

  // Deployment config
  organizationName: 'iezhkv', // Your GitHub username or organization name
  projectName: 'clever-volt', // Your GitHub repository name

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Edit URL for GitHub repository (for "Edit this page" link)
          editUrl: 'https://github.com/iezhkv/clever-volt/edit/main/',
        },
        
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      navbar: {
        title: 'Clever Volt',
        logo: {
          alt: 'Clever Volt Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/perfect-home',  // Link to markdown.md (assuming it's in the docs folder)
            label: 'Perfect Home ?',  // The text displayed in the navbar
            position: 'left',  // Position in the navbar (left, right, etc.)
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
          {
            // title: 'Community',
            // items: [
            //   {
            //     label: 'Stack Overflow',
            //     href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            //   },
            //   {
            //     label: 'Discord',
            //     href: 'https://discordapp.com/invite/docusaurus',
            //   },
            //   {
            //     label: 'Twitter',
            //     href: 'https://twitter.com/docusaurus',
            //   },
            // ],
          },
          // {
          //   title: 'More',
          //   items: [
              
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/iezhkv/clever-volt',
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Clever Volt, Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
