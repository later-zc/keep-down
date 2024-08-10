import fs from 'node:fs'
import path from 'node:path'

interface TGetAllFilesOptions {
    filter?: RegExp | string | undefined
    fileList?: string[]
}

/**
 * 递归获取指定文件夹下的所有文件路径
 * @param {string} dir 文件夹路径
 * @param {object} [options={}] 配置项
 * @param {string[]} [options.fileList=[]] 存储文件路径的数组
 * @param {RegExp | string | undefined} [options.filter] 过滤规则
 * @returns {string[]} 返回所有文件路径的数组
 */
export function getAllFiles(dir: string, { filter, fileList = []}: TGetAllFilesOptions = {}): string[] {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        // 如果指定了过滤规则且匹配当前文件或目录，则跳过
        if (filter) {
            if (typeof filter === 'string' && file.includes(filter)) {
                return;
            }
            if (filter instanceof RegExp && filter.test(filePath)) {
                return;
            }
        }

        if (stat.isDirectory()) {
            // 如果是文件夹，则递归获取其内部文件
            getAllFiles(filePath, {fileList, filter})
        } else {
            // 如果是文件，则将其路径存入数组
            fileList.push(filePath)
        }
    })
    return fileList
}
