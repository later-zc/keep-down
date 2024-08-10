import path from 'node:path'
import { getAllFiles } from '../src/utils'

/**
 * 侧边栏配置
 */
const sidebar: Record<string, any[]> = {}
const sidebarDirConfigList = [
  '/front-end/语言框架基础',
  '/front-end/坑坑洼洼不少',
  '/back-end/java'
]

sidebarDirConfigList.forEach((sidebarItem) => {
  const sidebarItemDirectoryPath = path.join(__dirname, `../src${sidebarItem}`)
  const sidebarItemAllFiles = getAllFiles(sidebarItemDirectoryPath, {
    filter: 'assets'
  })
  // 动态获取平台路径分隔符，并生成正则表达式
  const sep = path.sep.replace(/\\/g, '\\\\') // 转义反斜杠以适配正则表达式
  const regex = new RegExp(`${sep}src(?<relativePath>.*)`)
  // 处理路径，使用正则表达式匹配并提取 `src` 后面的路径
  const relativePaths = sidebarItemAllFiles.map(
    (filePath) => filePath?.match(regex)?.groups?.relativePath ?? filePath
  )
  // 匹配以.md结尾的文件名和所在上级目录文件夹名
  const fileNameRegex = new RegExp(`(?<directory>[^${sep}]+)${sep}(?<fileName>[^${sep}]+(?=\.md$))`)
  const fileNames = relativePaths.map((i) => ({
    link: i,
    ...(i?.match(fileNameRegex)?.groups as {
      directory: string
      fileName: string
    })
  }))
  // const directoryList: any[] = []
  // fileNames.forEach((i) => {
  //   if (i.directory && !directoryList.includes(i.directory)) {
  //     directoryList.push(i.directory)
  //   }
  // })

  console.log('🌈🌈🌈 fileNames: ', fileNames)
  sidebar[sidebarItem] = [
    {
      items: fileNames
        .reduce((pre: string[], cur) => {
          if (cur.directory && !pre.includes(cur.directory)) {
            pre.push(cur.directory)
          }
          return pre
        }, [])
        .map((i) => ({
          text: i,
          collapsed: false,
          items: fileNames
            .filter((j) => j.directory === i)
            .map((j) => ({
              text: j.fileName,
              link: j.link
            }))
        }))
    }
  ]
})

export default sidebar
