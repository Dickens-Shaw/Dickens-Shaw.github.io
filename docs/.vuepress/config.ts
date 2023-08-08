import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default';
import { navbar} from './config/navbar';
import { sidebar } from './config/sidebar';
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

// {
//   apiKey: 'f359e0507e8fbbfd7e01e3d41d8f6888',
//   indexName: '<INDEX_NAME>'
//   // 如果 Algolia 没有为你提供 `appId` ，使用 `BH4D9OD16A` 或者移除该配置项
//   appId: 'MPNYJVZ0Q9',
// }

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是一个 VuePress 站点',
  base: '/',
  plugins: [
    docsearchPlugin({
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
      },
    },
  }),
})