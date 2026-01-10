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
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  padding: 40px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.input-error {
  border-color: var(--status-borrowed);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--status-borrowed);
}

.error-message {
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--status-borrowed);
  border-radius: var(--radius-md);
  color: var(--status-borrowed);
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.btn-block {
  width: 100%;
  margin-top: 8px;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  margin-left: 4px;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.link-btn:hover {
  color: var(--primary-hover);
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }

  .auth-title {
    font-size: 24px;
  }
}
</style>
