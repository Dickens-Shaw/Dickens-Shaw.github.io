import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default';
import { navbar} from './config/navbar';
import { sidebar } from './config/sidebar';
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'

// docsearchPlugin({
//   appId: 'UMHCL6J1WP',
//   apiKey: '8d3c98c15e1d2ea1cc1f841fddeabeea',
//   indexName: 'dickens-shawio',
// }),

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是一个 VuePress 站点',
  base: '/',
  plugins: [],
  theme: defaultTheme({
    logo: '/images/logo.jpeg',
    locales: {
      '/': {
        navbar,
        sidebar,
        editLink: false,
      },
    },
  }),
})