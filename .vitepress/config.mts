import { defineConfig } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  srcDir: './src/docs',
  base: '/blog-laterzc/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,

    sidebar,
    outline: {
      label: '目录',
      level: [1, 6],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
