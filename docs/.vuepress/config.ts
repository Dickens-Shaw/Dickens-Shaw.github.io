import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default';
import { navbar} from './config/navbar';
import { sidebar } from './config/sidebar';
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是一个 VuePress 站点',
  base: '/',
  plugins: [
    docsearchPlugin({ // key: 35493897496dea045e0c647a857e6f5b
      appId: 'UMHCL6J1WP',
      apiKey: '8d3c98c15e1d2ea1cc1f841fddeabeea',
      indexName: 'dickens-shawio',
    }),
  ],
  theme: defaultTheme({
    logo: '/images/logo.jpeg',
    locales: {
      '/': {
        navbar,
        sidebar,
        editLink: false,
        contributors: false,
      },
    },
  }),
})