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

import axios from 'axios'

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

// ========== AI分析相关路由（需要认证）==========

// AI分析端点
app.post('/api/ai/analyze', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body

    // 验证输入
    if (!message) {
      return res.status(400).json({
        success: false,
        message: '消息内容不能为空'
      })
    }

    // 获取数据库中的图书数据
    const books = await getAllBooks('', 1, 1000) // 获取所有图书
    const booksCount = await getBooksCount()

    // 分析用户请求意图
    const analysisResult = await analyzeQuery(message, books, booksCount)

    res.json({
      success: true,
      data: analysisResult
    })
  } catch (error) {
    console.error('AI分析失败:', error)
    res.status(500).json({
      success: false,
      message: 'AI分析失败',
      error: error.message
    })
  }
})

// AI聊天端点
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body

    // 验证输入
    if (!question) {
      return res.status(400).json({
        success: false,
        message: '问题内容不能为空'
      })
    }

    // 获取数据库中的图书数据
    const books = await getAllBooks('', 1, 1000) // 获取所有图书
    const booksCount = await getBooksCount()

    // 分析用户请求意图
    const analysisResult = await analyzeQuery(question, books, booksCount)

    res.json({
      success: true,
      answer: analysisResult
    })
  } catch (error) {
    console.error('AI聊天失败:', error)
    res.status(500).json({
      success: false,
      message: 'AI聊天失败',
      error: error.message
    })
  }
})

// 分析查询意图并返回结果
async function analyzeQuery (userMessage, books, booksCount) {
  // 构建系统提示词
  const systemPrompt = `你是一个专业的图书管理系统AI助手。你可以根据图书数据回答用户的问题。
  
图书数据包含以下字段：
- id: 图书ID
- title: 书名
- author: 作者
- isbn: ISBN号
- publish_date: 出版日期
- status: 状态（在馆/借出）

根据用户的问题，从数据库中提取相关信息并提供准确的回答。

重要注意事项：
1. 回答必须使用纯文本格式，不能包含任何Markdown格式（如#标题、**加粗**、*斜体*、- 列表、1. 有序列表等）
2. 直接输出答案内容，不要添加任何格式标记
3. 保持回答简洁明了，使用普通文本分隔信息`

  // 构建用户查询
  const userQuery = `用户问题：${userMessage}\n\n图书数据（共${booksCount}本）：\n${JSON.stringify(
    books,
    null,
    2
  )}`

  try {
    // 调用DeepSeek API
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: 'Bearer sk-b22a0431c5b647038f321e1c37ddefd5',
          'Content-Type': 'application/json'
        }
      }
    )

    let content = response.data.choices[0].message.content
    // 移除可能的Markdown格式
    content = content.replace(/[*_`~#\-=+>\[\]]/g, '')
    // 移除多余的换行
    content = content.replace(/\n+/g, '\n')
    return content.trim()
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    // 如果API调用失败，提供基于规则的简单响应
    return fallbackAnalysis(userMessage, books, booksCount)
  }
}

// 回退分析函数
function fallbackAnalysis (userMessage, books, booksCount) {
  userMessage = userMessage.toLowerCase()

  if (userMessage.includes('总数') || userMessage.includes('多少本')) {
    return `图书馆共有 ${booksCount} 本图书。`
  } else if (
    userMessage.includes('借阅状态') ||
    userMessage.includes('状态分布')
  ) {
    const borrowed = books.filter(book => book.status === '借出').length
    const available = books.filter(book => book.status === '在馆').length
    return `图书状态分布：在馆：${available} 本，借出：${borrowed} 本`
  } else if (userMessage.includes('最新') || userMessage.includes('新出版')) {
    const sortedBooks = [...books]
      .sort((a, b) => {
        if (!a.publish_date) return 1
        if (!b.publish_date) return -1
        return new Date(b.publish_date) - new Date(a.publish_date)
      })
      .slice(0, 5)

    let result = '出版年份最新的5本书：'
    sortedBooks.forEach((book, index) => {
      result += `${index + 1}. ${book.title} - ${book.author} (${
        book.publish_date || '未知'
      }) `
    })
    return result
  } else if (userMessage.includes('作者') || userMessage.includes('分组')) {
    const authorCounts = {}
    books.forEach(book => {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1
    })

    const sortedAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    let result = '按作者统计图书数量（前10名）：'
    sortedAuthors.forEach(([author, count]) => {
      result += `${author}：${count} 本，`
    })
    // 移除最后一个逗号
    result = result.replace(/,$/, '')
    return result
  } else if (userMessage.includes('鲁迅')) {
    const luXunBooks = books.filter(book => book.author.includes('鲁迅'))
    let result = `鲁迅的书共有 ${luXunBooks.length} 本：`
    luXunBooks.forEach(book => {
      result += `${book.title}，`
    })
    // 移除最后一个逗号
    result = result.replace(/,$/, '')
    return result
  } else {
    return `根据您提供的图书数据，我为您找到以下信息：共有 ${booksCount} 本图书。如果您想了解特定信息，请尝试询问：帮我统计图书馆的图书总数，分析图书的借阅状态分布，找出出版年份最新的5本书，按作者分组统计图书数量`
  }
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
