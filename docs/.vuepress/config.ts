import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default';
import { navbar} from './config/navbar';
import { sidebar } from './config/sidebar';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Shaw',
  description: '这是我的第一个 VuePress 站点',
  base: '/documents/',
  plugins: [],
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