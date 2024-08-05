import { $PH01 } from '../src/constants/base-path'

const sidebar = {
  // {
  //   text: 'Examples',
  //   items: [
  //     { text: 'Markdown Examples', link: '/markdown-examples' },
  //     { text: 'Runtime API Examples', link: '/api-examples' },
  //   ],
  // },
  '/front-end/Web前端笔记': [
    {
      items: [
        {
          text: '01_HTML+CSS',
          collapsed: false,
          // link: '/front-end/Web前端笔记/01_HTML+CSS',
          items: [
            {
              text: '01. 网页显示过程、浏览器内核、为什么需要做适配',
              link: `${$PH01[0]}01. 网页显示过程、浏览器内核、为什么需要做适配`,
            },
            {
              text: '02. HTML结构、div-span元素历史、HTML全局属性、字符实体、URL、SEO、字符编码',
              link: `${$PH01[0]}02. HTML结构、div-span元素历史、HTML全局属性、字符实体、URL、SEO、字符编码.md`,
            },
          ],
        },
        { text: '02_JS基础', link: '/front-end/Web前端笔记/02_JS基础' },
      ],
    },
  ],
}

export default sidebar
