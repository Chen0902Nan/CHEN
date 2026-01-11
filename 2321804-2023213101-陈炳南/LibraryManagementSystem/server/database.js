import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'library.db')

// 创建数据库连接
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('数据库连接失败:', err.message)
  } else {
    console.log('已连接到 SQLite 数据库')
  }
})

// 将回调函数转换为 Promise
const dbRun = promisify(db.run.bind(db))
const dbAll = promisify(db.all.bind(db))
const dbGet = promisify(db.get.bind(db))

// 初始化数据库表
export async function initDatabase () {
  try {
    // 创建图书表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE,
        publish_date TEXT,
        status TEXT DEFAULT '在馆' CHECK(status IN ('在馆', '借出'))
      )
    `)

    // 创建用户表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('数据库表初始化成功')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    throw error
  }
}

// 获取图书总数
export async function getBooksCount (search = '') {
  try {
    if (search) {
      const query = `
        SELECT COUNT(*) as count FROM books 
        WHERE title LIKE ? OR author LIKE ?
      `
      const searchTerm = `%${search}%`
      const result = await dbGet(query, [searchTerm, searchTerm])
      return result.count
    } else {
      const query = `SELECT COUNT(*) as count FROM books`
      const result = await dbGet(query)
      return result.count
    }
  } catch (error) {
    console.error('获取图书总数失败:', error)
    throw error
  }
}

// 获取所有图书（支持分页和搜索）
export async function getAllBooks (search = '', page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit

    if (search) {
      const query = `
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ?
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `
      const searchTerm = `%${search}%`
      return await dbAll(query, [searchTerm, searchTerm, limit, offset])
    } else {
      const query = `
        SELECT * FROM books 
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `
      return await dbAll(query, [limit, offset])
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
    throw error
  }
}

// 根据 ID 获取图书
export async function getBookById (id) {
  try {
    const query = `SELECT * FROM books WHERE id = ?`
    return await dbGet(query, [id])
  } catch (error) {
    console.error('获取图书失败:', error)
    throw error
  }
}

// 添加图书
export async function addBook (book) {
  try {
    const { title, author, isbn, publish_date, status = '在馆' } = book
    const query = `
      INSERT INTO books (title, author, isbn, publish_date, status)
      VALUES (?, ?, ?, ?, ?)
    `
    return new Promise((resolve, reject) => {
      db.run(
        query,
        [title, author, isbn || null, publish_date || null, status],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve({ id: this.lastID, ...book })
          }
        }
      )
    })
  } catch (error) {
    console.error('添加图书失败:', error)
    throw error
  }
}

// 更新图书
export async function updateBook (id, book) {
  try {
    const { title, author, isbn, publish_date, status } = book
    const query = `
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, publish_date = ?, status = ?
      WHERE id = ?
    `
    await dbRun(query, [
      title,
      author,
      isbn || null,
      publish_date || null,
      status,
      id
    ])
    return { id, ...book }
  } catch (error) {
    console.error('更新图书失败:', error)
    throw error
  }
}

// 删除图书
export async function deleteBook (id) {
  try {
    const query = `DELETE FROM books WHERE id = ?`
    await dbRun(query, [id])
    return true
  } catch (error) {
    console.error('删除图书失败:', error)
    throw error
  }
}

// 清空所有图书（用于重置数据）
export async function clearAllBooks () {
  try {
    await dbRun('DELETE FROM books')
    console.log('已清空所有图书数据')
    return true
  } catch (error) {
    console.error('清空图书数据失败:', error)
    throw error
  }
}

// ========== 用户相关函数 ==========

// 根据用户名查找用户
export async function getUserByUsername (username) {
  try {
    const query = `SELECT * FROM users WHERE username = ?`
    return await dbGet(query, [username])
  } catch (error) {
    console.error('查找用户失败:', error)
    throw error
  }
}

// 根据邮箱查找用户
export async function getUserByEmail (email) {
  try {
    const query = `SELECT * FROM users WHERE email = ?`
    return await dbGet(query, [email])
  } catch (error) {
    console.error('查找用户失败:', error)
    throw error
  }
}

// 创建用户
export async function createUser (user) {
  try {
    const { username, email, password } = user
    const query = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `
    return new Promise((resolve, reject) => {
      db.run(query, [username, email, password], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, username, email })
        }
      })
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    throw error
  }
}

// 关闭数据库连接
export function closeDatabase () {
  return new Promise((resolve, reject) => {
    db.close(err => {
      if (err) {
        reject(err)
      } else {
        console.log('数据库连接已关闭')
        resolve()
      }
    })
  })
}

export default db
