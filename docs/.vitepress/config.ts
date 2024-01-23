import { defineConfig } from 'vitepress';
import { nav } from './config/nav';
import { algolia } from './config/algolia';
import { sidebar } from './config/sidebar';
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'
export default defineConfig({
  outDir: '../dist',
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是一个 VuePress 站点',
  base: '/',
  themeConfig: {
    logo: '/images/logo.jpeg',
    nav,
    sidebar,
    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '本页目录',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/maomao1996' }],

    footer: {
      message: '随意',
      copyright: 'Copyright',
    },

    darkModeSwitchLabel: '外观',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '上次更新',

    algolia,

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
});
