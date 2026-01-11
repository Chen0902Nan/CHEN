import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// 生成JWT token
export function generateToken (user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// 验证JWT token
export function verifyToken (token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// 密码加密
export async function hashPassword (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// 验证密码
export async function comparePassword (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// 认证中间件
export function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供访问令牌'
    })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: '无效或过期的访问令牌'
    })
  }

  req.user = decoded
  next()
}

