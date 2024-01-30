import type { DefaultTheme } from 'vitepress';

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
      },
    ],
    activeMatch: '^/basic',
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
    activeMatch: '^/frame',
  },
  {
    text: '进阶',
    items: [
      {
        text: '浏览器',
        link: '/advance/browser',
      },
      {
        text: '网络',
        link: '/advance/network',
      },
      {
        text: '手撸代码',
        link: '/advance/handwriting',
      },
      {
        text: '代码输出',
        link: '/advance/output',
      },
      {
        text: 'Typescript',
        link: '/advance/typescript',
      },
      {
        text: '设计模式',
        link: '/advance/design',
      },
      {
        text: '数据结构',
        link: '/advance/data',
      },
      {
        text: '算法',
        link: '/advance/arithmetic',
      },
    ],
    activeMatch: '^/advance',
  },
  {
    text: '架构',
    items: [
      {
        text: '项目优化',
        link: '/architecture/optimize',
      },
      {
        text: '工程化',
        link: '/architecture/engineering',
      },
      {
        text: '微前端',
        link: '/architecture/micro',
      },
      {
        text: '大前端',
        link: '/architecture/cross',
      },
      {
        text: '低代码',
        link: '/architecture/lowcode',
      },
    ],
    activeMatch: '^/architecture',
  },
  {
    text: '其它',
    items: [
      {
        text: '格式化',
        link: '/others/formatter',
      },
      {
        text: '掘金',
        link: '/others/juejin',
      },
      {
        text: '微信',
        link: '/others/wechat',
      },
      {
        text: 'xmind',
        link: '/others/xmind/css',
      },
    ],
    activeMatch: '^/others',
  },
];
