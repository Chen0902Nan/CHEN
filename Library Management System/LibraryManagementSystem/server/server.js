import express from 'express'
import cors from 'cors'
import {
  initDatabase,
  getAllBooks,
  getBooksCount,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getUserByUsername,
  getUserByEmail,
  createUser
} from './database.js'
import {
  generateToken,
  hashPassword,
  comparePassword,
  authenticateToken
} from './auth.js'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())

// 初始化数据库
initDatabase().catch(console.error)

// ========== 认证相关路由 ==========

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码为必填项'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6位'
      })
    }

    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      })
    }

    // 检查邮箱是否已存在
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册'
      })
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 创建用户
    const user = await createUser({
      username,
      email,
      password: hashedPassword
    })

    // 生成token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    })
  }
})

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码为必填项'
      })
    }

    // 查找用户
    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 生成token
    const token = generateToken(user)

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    })
  }
})

// 验证token（获取当前用户信息）
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByUsername(req.user.username)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    })
  }
})

// ========== 图书管理路由（需要认证） ==========

// 获取所有图书（支持搜索和分页）
app.get('/api/books', async (req, res) => {
  try {
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const [books, total] = await Promise.all([
      getAllBooks(search, page, limit),
      getBooksCount(search)
    ])

    const totalPages = Math.ceil(total / limit)

    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取图书列表失败',
      error: error.message
    })
  }
})

// 根据 ID 获取图书
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await getBookById(req.params.id)
    if (book) {
      res.json({ success: true, data: book })
    } else {
      res.status(404).json({ success: false, message: '图书不存在' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: '获取图书失败', error: error.message })
  }
})

// 添加图书（需要认证）
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, author, isbn, publish_date, status } = req.body

    if (!title || !author) {
      return res
        .status(400)
        .json({ success: false, message: '书名和作者为必填项' })
    }

    const book = await addBook({ title, author, isbn, publish_date, status })
    res.status(201).json({ success: true, data: book })
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(400).json({ success: false, message: 'ISBN 已存在' })
    } else {
      res
        .status(500)
        .json({ success: false, message: '添加图书失败', error: error.message })
    }
  }
})

// 更新图书（需要认证）
app.put('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const { title, author, isbn, publish_date, status } = req.body

    if (!title || !author) {
      return res
        .status(400)
        .json({ success: false, message: '书名和作者为必填项' })
    }

    const book = await updateBook(req.params.id, {
      title,
      author,
      isbn,
      publish_date,
      status
    })
    res.json({ success: true, data: book })
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(400).json({ success: false, message: 'ISBN 已存在' })
    } else {
      res
        .status(500)
        .json({ success: false, message: '更新图书失败', error: error.message })
    }
  }
})

// 删除图书（需要认证）
app.delete('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    await deleteBook(req.params.id)
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: '删除图书失败', error: error.message })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
