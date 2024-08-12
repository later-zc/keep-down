import { defineConfig } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'later-zc的知识笔记',
  description: 'later-zc 的知识笔记，包含前后端常用基础知识、踩坑记录、开发心得等',
  srcDir: './src',
  base: '/keep-down/',
  head: [['link', { rel: 'icon', href: '/keep-down/favicon.ico' }]],
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,

    sidebar,
    outline: {
      label: '目录',
      level: [1, 6],
    },
    lastUpdated: {
      text: '最近更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    search: {
      provider: 'local',
    },
    logo: '/logo.png',

    editLink: {
      pattern: 'https://github.com/later-zc/keep-down/tree/main/src/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/later-zc/keep-down' }],
  },
})
