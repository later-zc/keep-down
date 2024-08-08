import { defineConfig } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'later-zc的知识笔记',
  description: 'later-zc 的知识笔记，包含Web前端、后端的开发知识',
  srcDir: './src/docs',
  base: '/blog-laterzc/',
  head: [['link', { rel: 'icon', href: '/blog-laterzc/favicon.ico' }]],
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
      pattern: 'https://github.com/later-zc/blog-laterzc/tree/main/src/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/later-zc/blog-laterzc' }],
  },
})
