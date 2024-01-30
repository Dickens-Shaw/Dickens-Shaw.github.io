import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/basic/': [
    {
      text: '前端基础',
      collapsed: false,
      items: [
        { text: 'HTML基础', link: '/basic/html' },
        { text: 'CSS基础', link: '/basic/css' },
        { text: 'JS基础', link: '/basic/js' },
        { text: 'ES6+', link: '/basic/es6' },
        { text: '异步编程', link: '/basic/async' },
      ],
    },
  ],
  '/advance/': [
    {
      text: '进阶知识',
      collapsed: false,
      items: [
        { text: '浏览器', link: '/advance/browser' },
        { text: '网络', link: '/advance/network' },
        { text: '手撸代码', link: '/advance/handwriting' },
        { text: '代码输出', link: '/advance/output' },
        { text: 'Typescript', link: '/advance/typescript' },
        { text: '设计模式', link: '/advance/design' },
        { text: '数据结构', link: '/advance/data' },
        { text: '算法', link: '/advance/arithmetic' },
      ],
    },
  ],
  '/frame/': [
    {
      text: '前端框架',
      collapsed: false,
      items: [
        { text: 'MVVM', link: '/frame/common' },
        { text: 'React', link: '/frame/react' },
        { text: 'Vue', link: '/frame/vue' },
      ],
    },
  ],
  '/architecture/': [
    {
      text: '前端架构',
      collapsed: false,
      items: [
        { text: '性能优化', link: '/architecture/optimize' },
        { text: '工程化', link: '/architecture/engineering' },
        { text: '微前端', link: '/architecture/micro' },
        { text: '跨端', link: '/architecture/cross' },
        { text: '低代码', link: '/architecture/lowcode' },
      ],
    },
  ],
  '/others/': [
    {
      text: '其它',
      collapsed: false,
      items: [
        { text: '格式化', link: '/others/formatter' },
        { text: '掘金', link: '/others/juejin' },
        { text: '微信', link: '/others/wechat' },
        {
          text: 'xmind',
          collapsed: false,
          items: [
            { text: 'CSS', link: '/others/xmind/css' },
            { text: 'JS', link: '/others/xmind/javascript' },
            { text: 'ES6+', link: '/others/xmind/es6' },
            { text: 'React', link: '/others/xmind/react' },
            { text: 'Vue', link: '/others/xmind/vue' },
            { text: '网络', link: '/others/xmind/http' },
            { text: 'TS', link: '/others/xmind/typescript' },
            { text: 'Webpack', link: '/others/xmind/webpack' },
            { text: '正则', link: '/others/xmind/regular' },
            { text: 'Axios', link: '/others/xmind/axios' },
          ],
        },
      ],
    },
  ],
};
