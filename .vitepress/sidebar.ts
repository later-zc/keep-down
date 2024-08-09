import path from "node:path"
import { $BACK_END_PATH_01, $FRONT_END_PATH_01 } from '../src/constants/base-path'
import {getAllFiles} from "../src/utils";

/**
 * @description 侧边栏配置
 */
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

const sidebarDirConfigList = [
    '/front-end/语言框架基础',
    '/front-end/坑坑洼洼不少',
    '/back-end/java',
]

sidebarDirConfigList.forEach(sidebarItem => {
  const sidebarItemDirectoryPath = path.join(__dirname, `../src${sidebarItem}`)
  const sidebarItemAllFiles = getAllFiles(sidebarItemDirectoryPath)
  // 动态获取平台路径分隔符，并生成正则表达式
  const platFormSeparator = path.sep.replace(/\\/g, '\\\\'); // 转义反斜杠以适配正则表达式
  const regex = new RegExp(`${platFormSeparator}src(?<relativePath>.*)`);
  // 处理路径，使用正则表达式匹配并提取 `src` 后面的路径
  const relativePaths = sidebarItemAllFiles.map(filePath => filePath?.match(regex)?.groups?.relativePath ?? filePath);
  // const items = []
  //
  // // @ts-ignore
  // sidebar[sidebarItem] = [
  //   {
  //     items
  //   }
  // ]
})

const directoryPath = path.join(__dirname, '../src/front-end/语言框架基础')
console.log('🌈🌈🌈 directoryPath: ', directoryPath)

const allFiles = getAllFiles(directoryPath)
console.log('🌈🌈🌈 allFiles: ', allFiles)
// 动态获取平台路径分隔符，并生成正则表达式
const sep = path.sep.replace(/\\/g, '\\\\'); // 转义反斜杠以适配正则表达式
const regex = new RegExp(`${sep}src(?<relativePath>.*)`);

// 处理路径，使用正则表达式匹配并提取 `src` 后面的路径
const relativePaths = allFiles.map(filePath => {
  const match = filePath.match(regex);
  return match ? match?.groups?.relativePath : filePath;
});
console.log('🌈🌈🌈 relativePaths: ', relativePaths)
// 匹配以.md结尾的文件名和所在上级目录文件夹名
const fileNameRegex = new RegExp(`(?<directory>[^${sep}]+)${sep}(?<fileName>[^${sep}]+(?=\.md$))`)
const fileNames = relativePaths.map(i => i?.match(fileNameRegex)?.groups)
console.log('🌈🌈🌈 fileNames: ', fileNames)


export default sidebar
