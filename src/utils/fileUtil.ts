import fs from 'node:fs'
import path from 'node:path'

/**
 * 递归获取指定文件夹下的所有文件路径
 * @param {string} dir 文件夹路径
 * @param {string[]} fileList 用于存储文件路径的数组
 * @returns {string[]} 返回所有文件路径的数组
 */
export function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            // 如果是文件夹，则递归获取其内部文件
            getAllFiles(filePath, fileList)
        } else {
            // 如果是文件，则将其路径存入数组
            fileList.push(filePath)
        }
    })
    return fileList
}
