import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = {
  '/basic/': [{
    text: '前端基础',
    collapsible: false,
    children: [
      '/basic/css',
      '/basic/js',
      '/basic/es6',
      '/basic/async',
      '/basic/eventLoop',
    ]
  }],
  '/advance/': [{
    text: '进阶知识',
    collapsible: false,
    children: [
      '/advance/browser',
      '/advance/network',
      '/advance/typescript',
      '/advance/design',
      '/advance/data'
    ]
  }],
  '/frame/': [{
    text: '前端框架',
    collapsible: false,
    children: [
      '/frame/common',
      '/frame/react',
      '/frame/vue',
    ]
  }],
  '/architecture/': [
    {
      text: '前端架构',
      collapsible: false,
      children: [
        '/architecture/optimize',
        '/architecture/engineering',
        '/architecture/micro',
        '/architecture/cross',
        '/architecture/lowcode',
      ]
    },
  ],
  '/bookmark/': [
    {
      text: '收藏夹',
      collapsible: false,
      children: [
        '/bookmark/formatter',
        '/bookmark/juejin',
        '/bookmark/wechat',
      ]
    },
  ],
}