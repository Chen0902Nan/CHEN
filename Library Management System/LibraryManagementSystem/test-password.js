import { comparePassword } from './server/auth.js'
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
const dbGet = promisify(db.get.bind(db))

async function testPassword() {
  try {
    // 获取admin用户的密码
    const query = `SELECT * FROM users WHERE username = ?`
    const user = await dbGet(query, ['admin'])
    
    console.log('用户信息:', user)
    
    if (user) {
      // 验证密码
      const isValid = await comparePassword('password123', user.password)
      console.log('密码验证结果:', isValid)
    }
  } catch (error) {
    console.error('测试密码时出错:', error)
  } finally {
    db.close()
  }
}

testPassword()