import { $BACK_END_PATH_01, $FRONT_END_PATH_01 } from '../src/constants/base-path'

const sidebar = {
  // {
  //   text: 'Examples',
  //   items: [
  //     { text: 'Markdown Examples', link: '/markdown-examples' },
  //     { text: 'Runtime API Examples', link: '/api-examples' },
  //   ],
  // },
  '/front-end/语言框架基础': [
    {
      items: [
        {
          text: '01_HTML+CSS',
          collapsed: false,
          // link: '/front-end/Web前端笔记/01_HTML+CSS',
          items: [
            {
              text: '01. 网页显示过程、浏览器内核、为什么需要做适配',
              link: `${$FRONT_END_PATH_01[0]}01. 网页显示过程、浏览器内核、为什么需要做适配`,
            },
            {
              text: '02. HTML结构、div-span元素历史、HTML全局属性、字符实体、URL、SEO、字符编码',
              link: `${$FRONT_END_PATH_01[0]}02. HTML结构、div-span元素历史、HTML全局属性、字符实体、URL、SEO、字符编码.md`,
            },
          ],
        },
        { text: '02_JS基础', link: '/front-end/语言框架基础/02_JS基础' },
      ],
    },
  ],
  '/back-end/java': [
    {
      items: [
        {
          text: '01_Java基础',
          collapsed: false,
          items: [
            {
              text: '01. Java语言概述',
              link: `${$BACK_END_PATH_01[0]}01. Java语言概述`,
            },
          ],
        },
      ],
    },
  ],
}

export default sidebar
