import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '基础',
    items: [
      {
        text: 'HTML基础',
        link: '/basic/html',
      },
      {
        text: 'CSS基础',
        link: '/basic/css',
      },
      {
        text: 'JS基础',
        link: '/basic/js',
      },
      {
        text: 'ES6+',
        link: '/basic/es6',
      },
      {
        text: '异步编程',
        link: '/basic/async',
      }
    ],
    activeMatch: '^/basic'
  },
  {
    text: '框架',
    items: [
      {
        text: 'MVVM',
        link: '/frame/common',
      },
      {
        text: 'React',
        link: '/frame/react',
      },
      {
        text: 'Vue',
        link: '/frame/vue',
      },
    ],
    activeMatch: '^/frame'
  },
  {
    text: '进阶',
    items: [
      {
        text: '浏览器',
        link: '/advance/browser'
      },
      {
        text: '网络',
        link: '/advance/network'
      },
      {
        text: 'TS',
        link: '/advance/typescript'
      },
      {
        text: '设计模式',
        link: '/advance/design'
      },
      {
        text: '数据结构&算法',
        link: '/advance/data'
      },
    ],
    activeMatch: '^/advance'
  },
  {
    text: '架构',
    items: [
      {
        text: '项目优化',
        link: '/architecture/optimize'
      },
      {
        text: '工程化',
        link: '/architecture/engineering'
      },
      {
        text: '微前端',
        link: '/architecture/micro'
      },
      {
        text: '大前端',
        link: '/architecture/cross'
      },
      {
        text: '低代码',
        link: '/architecture/lowcode'
      },
    ],
    activeMatch: '^/architecture'
  },
  {
    text: '收藏夹',
    items: [
      {
        text: '格式化',
        link: '/bookmark/formatter',
      },
      {
        text: '掘金',
        link: '/bookmark/juejin'
      },
      {
        text: '微信',
        link: '/bookmark/wechat'
      },
    ],
    activeMatch: '^/bookmark'
  },
]