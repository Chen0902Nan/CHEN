import bcrypt from 'bcryptjs'

// 数据库中存储的密码哈希
const hashedPassword = '$2a$10$3UxkK5Umul4PW2kvIjwJae66A86EKQ8vyZYeWyF/Wp9aFgcNHvz56'

// 用户输入的密码
const userPassword = 'admin123'

// 验证密码
async function verifyPassword() {
  try {
    const isMatch = await bcrypt.compare(userPassword, hashedPassword)
    console.log(`密码验证结果: ${isMatch}`)
    if (isMatch) {
      console.log('✅ 密码正确！')
    } else {
      console.log('❌ 密码不正确！')
    }
  } catch (error) {
    console.error('密码验证失败:', error)
  }
}

// 执行验证
verifyPassword()
