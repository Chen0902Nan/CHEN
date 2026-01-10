import { hashPassword } from './server/auth.js'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'server/library.db')

// 创建数据库连接
const db = new sqlite3.Database(dbPath)

// 将回调函数转换为 Promise
const dbRun = promisify(db.run.bind(db))

async function resetAdminPassword() {
  try {
    // 重置admin用户的密码为 'admin123'
    const newPassword = 'admin123'
    const hashedPassword = await hashPassword(newPassword)
    
    const query = `UPDATE users SET password = ? WHERE username = ?`
    await dbRun(query, [hashedPassword, 'admin'])
    
    console.log('已重置admin用户密码为:', newPassword)
  } catch (error) {
    console.error('重置密码时出错:', error)
  } finally {
    db.close()
  }
}

resetAdminPassword()