import type { NavbarConfig } from '@vuepress/theme-default'

export const navbar: NavbarConfig = [
  {
    text: '基础',
    children: [
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
      },
      {
        text: '事件循环',
        link: '/basic/eventLoop',
      }
    ]
  },
  {
    text: '进阶',
    children: [
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
    ]
  },
  {
    text: '框架',
    children: [
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
    ]
  },
  {
    text: '架构',
    children: [
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
  },
  {
    text: '收藏夹',
    children: [
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
  },
]