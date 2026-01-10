import { fileURLToPath } from 'url'
import path from 'path'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'server', 'library.db')

// 创建数据库连接
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('数据库连接失败:', err.message)
    process.exit(1)
  } else {
    console.log('已连接到 SQLite 数据库')
  }
})

// 将回调函数转换为 Promise
const dbAll = promisify(db.all.bind(db))

// 检查用户表
async function checkUsers() {
  try {
    console.log('检查用户表中的记录：')
    const users = await dbAll('SELECT * FROM users')
    
    if (users.length === 0) {
      console.log('用户表为空，没有用户记录')
    } else {
      console.log(`找到 ${users.length} 个用户：`)
      users.forEach(user => {
        console.log(`- 用户 ID: ${user.id}`)
        console.log(`  用户名: ${user.username}`)
        console.log(`  邮箱: ${user.email}`)
        console.log(`  密码哈希: ${user.password}`)
        console.log(`  创建时间: ${user.created_at}`)
        console.log('---')
      })
    }
    
    // 关闭数据库连接
    db.close(err => {
      if (err) {
        console.error('关闭数据库连接失败:', err.message)
      } else {
        console.log('数据库连接已关闭')
      }
    })
    
  } catch (error) {
    console.error('查询用户失败:', error)
    db.close()
    process.exit(1)
  }
}

// 执行检查
checkUsers()
