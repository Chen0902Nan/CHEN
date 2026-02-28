// langchain tool 工具
import { tool } from '@langchain/core/tools'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { z } from 'zod'

// 读取文件工具
const readFileTool = tool(async ({ filePath }) => {
  try {
    console.log(
      `[工具调用] read_file("${filePath}") 成功读取 ${content.length} 字节`
    )
    const content = await fs.readFile(filePath, 'utf-8')
    return `文件内容：\n${content}`
  } catch (error) {
    console.log(`工具调用 read_file("${filePath}") 失败: ${error.message}`)
    return `错误：${error.message}`
  }
})

export { readFileTool, writeFileTool, executeCommanTool, listDirectoryTool }
