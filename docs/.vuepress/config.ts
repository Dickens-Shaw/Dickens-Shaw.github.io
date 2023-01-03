import { defineUserConfig } from 'vuepress'
import  { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { navbar} from './config/navbar';
import { sidebar } from './config/sidebar';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是我的第一个 VuePress 站点',
  dest: './dist',
  base: '/documents/',
  plugins: [
    [
      searchPlugin({
        // 配置项
        locales: {
          '/': {
            placeholder: '搜索',
          }
        },
      }),
    ],
  ],
  theme: defaultTheme({
    logo: '/images/logo.jpeg',
    locales: {
      '/': {
        navbar,
        sidebar,
        editLink: false,
      },
    }
  }),
})