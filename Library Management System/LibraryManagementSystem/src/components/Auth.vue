<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login-success'])

const isLogin = ref(true) // true: 登录模式, false: 注册模式
const loading = ref(false)
const errors = ref({})

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 注册表单
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 切换登录/注册模式
function toggleMode () {
  isLogin.value = !isLogin.value
  errors.value = {}
  loginForm.value = { username: '', password: '' }
  registerForm.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}

// 验证登录表单
function validateLogin () {
  errors.value = {}
  let isValid = true

  if (!loginForm.value.username.trim()) {
    errors.value.username = '请输入用户名'
    isValid = false
  }

  if (!loginForm.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  }

  return isValid
}

// 验证注册表单
function validateRegister () {
  errors.value = {}
  let isValid = true

  if (!registerForm.value.username.trim()) {
    errors.value.username = '请输入用户名'
    isValid = false
  } else if (registerForm.value.username.length < 3) {
    errors.value.username = '用户名至少3个字符'
    isValid = false
  }

  if (!registerForm.value.email.trim()) {
    errors.value.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!registerForm.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (registerForm.value.password.length < 6) {
    errors.value.password = '密码长度至少6位'
    isValid = false
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

// 处理登录
async function handleLogin () {
  if (!validateLogin()) return

  loading.value = true
  errors.value.submit = ''
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password
      })
    })

    // 检查响应类型
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(`服务器返回了非JSON响应: ${text.substring(0, 100)}`)
    }

    const result = await response.json()

    if (result.success) {
      // 保存token和用户信息
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      emit('login-success', result.data)
    } else {
      errors.value.submit = result.message || '登录失败'
    }
  } catch (error) {
    console.error('登录错误:', error)
    errors.value.submit = '网络错误：' + error.message
  } finally {
    loading.value = false
  }
}

// 处理注册
async function handleRegister () {
  if (!validateRegister()) return

  loading.value = true
  errors.value.submit = ''
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password
      })
    })

    // 检查响应类型
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(
        `服务器返回了非JSON响应。请确保后端服务器正在运行在 http://localhost:3000`
      )
    }

    const result = await response.json()

    if (result.success) {
      // 保存token和用户信息
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      emit('login-success', result.data)
    } else {
      errors.value.submit = result.message || '注册失败'
    }
  } catch (error) {
    console.error('注册错误:', error)
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      errors.value.submit =
        '无法连接到服务器。请确保后端服务器正在运行在 http://localhost:3000'
    } else {
      errors.value.submit = '网络错误：' + error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">📚 智能图书管理系统</h1>
        <p class="auth-subtitle">
          {{ isLogin ? '欢迎回来' : '创建新账户' }}
        </p>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            class="input"
            :class="{ 'input-error': errors.username }"
            placeholder="请输入用户名"
            autocomplete="username"
          />
          <span v-if="errors.username" class="error-text">{{
            errors.username
          }}</span>
        </div>

        <div class="form-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            class="input"
            :class="{ 'input-error': errors.password }"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="error-text">{{
            errors.password
          }}</span>
        </div>

        <div v-if="errors.submit" class="error-message">
          {{ errors.submit }}
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="auth-switch">
          <span>还没有账户？</span>
          <button type="button" class="link-btn" @click="toggleMode">
            立即注册
          </button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            class="input"
            :class="{ 'input-error': errors.username }"
            placeholder="请输入用户名（至少3个字符）"
            autocomplete="username"
          />
          <span v-if="errors.username" class="error-text">{{
            errors.username
          }}</span>
        </div>

        <div class="form-group">
          <label for="register-email">邮箱</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            class="input"
            :class="{ 'input-error': errors.email }"
            placeholder="请输入邮箱地址"
            autocomplete="email"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="register-password">密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            class="input"
            :class="{ 'input-error': errors.password }"
            placeholder="请输入密码（至少6位）"
            autocomplete="new-password"
          />
          <span v-if="errors.password" class="error-text">{{
            errors.password
          }}</span>
        </div>

        <div class="form-group">
          <label for="register-confirm">确认密码</label>
          <input
            id="register-confirm"
            v-model="registerForm.confirmPassword"
            type="password"
            class="input"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="请再次输入密码"
            autocomplete="new-password"
          />
          <span v-if="errors.confirmPassword" class="error-text">{{
            errors.confirmPassword
          }}</span>
        </div>

        <div v-if="errors.submit" class="error-message">
          {{ errors.submit }}
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="auth-switch">
          <span>已有账户？</span>
          <button type="button" class="link-btn" @click="toggleMode">
            立即登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 背景和容器样式 */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 背景装饰元素 */
.auth-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  animation: float 20s ease-in-out infinite;
}

/* 添加更多背景装饰 */
.auth-container::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

@keyframes float {
  0%,
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateX(30px) translateY(-30px) rotate(90deg);
  }
  50% {
    transform: translateX(0) translateY(-50px) rotate(180deg);
  }
  75% {
    transform: translateX(-30px) translateY(-30px) rotate(270deg);
  }
}

/* 主卡片样式 */
.auth-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 440px;
  padding: 56px 48px;
  animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

/* 卡片悬停效果 */
.auth-card:hover {
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 头部样式 */
.auth-header {
  text-align: center;
  margin-bottom: 48px;
}

.auth-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  letter-spacing: -0.5px;
}

/* 标题装饰 */
.auth-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 2px;
  opacity: 0.7;
}

.auth-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
  font-weight: 400;
  line-height: 1.6;
  opacity: 0.8;
}

/* 表单样式 */
.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 32px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  opacity: 0.9;
}

/* 自定义输入框样式 */
.input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  color: var(--text-primary);
  background-color: rgba(255, 255, 255, 0.95);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 400;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 输入框焦点效果 */
.input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.18);
}

/* 输入框占位符样式 */
.input::placeholder {
  color: #9ca3af;
  font-weight: 300;
  opacity: 0.8;
}

/* 输入框错误状态 */
.input-error {
  border-color: var(--status-borrowed);
  background-color: rgba(239, 68, 68, 0.08);
}

.input-error:focus {
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.18);
  background-color: rgba(255, 255, 255, 1);
}

/* 错误文本样式 */
.error-text {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  color: var(--status-borrowed);
  font-weight: 500;
  letter-spacing: 0.3px;
  opacity: 0.9;
}

/* 错误消息样式 */
.error-message {
  padding: 18px 24px;
  background-color: rgba(239, 68, 68, 0.12);
  border: 2px solid var(--status-borrowed);
  border-radius: 16px;
  color: var(--status-borrowed);
  font-size: 14px;
  margin-bottom: 28px;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
  opacity: 0.9;
}

/* 按钮样式 */
.btn-block {
  width: 100%;
  margin-top: 8px;
  padding: 16px 0;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

/* 按钮悬停效果 */
.btn-block:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
}

/* 按钮点击效果 */
.btn-block:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

/* 按钮禁用状态 */
.btn-block:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* 登录/注册切换样式 */
.auth-switch {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: var(--text-secondary);
  opacity: 0.9;
}

.link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  padding: 0;
  margin-left: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  opacity: 0.9;
}

/* 链接按钮悬停效果 */
.link-btn:hover {
  color: #2563eb;
  opacity: 1;
}

/* 链接下划线动画 */
.link-btn::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  transition: width 0.3s ease;
}

.link-btn:hover::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-card {
    padding: 40px 32px;
    border-radius: 20px;
  }

  .auth-title {
    font-size: 28px;
  }

  .auth-title::after {
    width: 50px;
    height: 3px;
  }

  .form-group {
    margin-bottom: 28px;
  }

  .input {
    padding: 14px 18px;
    font-size: 15px;
  }

  .btn-block {
    padding: 14px 0;
    font-size: 15px;
  }
}

/* 动画延迟效果 */
.form-group {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.form-group:nth-child(1) {
  animation-delay: 0.1s;
}
.form-group:nth-child(2) {
  animation-delay: 0.2s;
}
.form-group:nth-child(3) {
  animation-delay: 0.3s;
}
.form-group:nth-child(4) {
  animation-delay: 0.4s;
}
.form-group:nth-child(5) {
  animation-delay: 0.5s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
