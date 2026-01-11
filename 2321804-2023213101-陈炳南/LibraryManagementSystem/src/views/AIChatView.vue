<script setup>
import { ref, onMounted, computed } from 'vue'

const messages = ref([
  {
    id: 1,
    text: '你好！我是图书分析助手，有什么可以帮助您的吗？',
    isAI: true,
    timestamp: new Date().toLocaleTimeString()
  }
])

// 获取当前登录用户信息
const currentUser = computed(() => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
})

const inputMessage = ref('')
const loading = ref(false)

// 发送消息
async function sendMessage () {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = {
    id: messages.value.length + 1,
    text: inputMessage.value.trim(),
    isAI: false,
    timestamp: new Date().toLocaleTimeString()
  }

  messages.value.push(userMessage)
  const message = inputMessage.value.trim()
  inputMessage.value = ''

  // 滚动到底部
  scrollToBottom()

  loading.value = true

  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message
      })
    })

    const result = await response.json()

    if (result.success) {
      const aiMessage = {
        id: messages.value.length + 1,
        text: result.data,
        isAI: true,
        timestamp: new Date().toLocaleTimeString()
      }
      messages.value.push(aiMessage)
    } else {
      const errorMessage = {
        id: messages.value.length + 1,
        text: `抱歉，出现错误：${result.message}`,
        isAI: true,
        timestamp: new Date().toLocaleTimeString()
      }
      messages.value.push(errorMessage)
    }
  } catch (error) {
    const errorMessage = {
      id: messages.value.length + 1,
      text: `抱歉，出现错误：${error.message}`,
      isAI: true,
      timestamp: new Date().toLocaleTimeString()
    }
    messages.value.push(errorMessage)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// 处理回车键发送
function handleKeyDown (event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 滚动到底部
function scrollToBottom () {
  setTimeout(() => {
    const chatContainer = document.querySelector('.chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, 100)
}

// 预设问题
const presetQuestions = [
  '帮我统计图书馆的图书总数',
  '分析图书的借阅状态分布',
  '找出出版年份最新的5本书',
  '按作者分组统计图书数量',
  '鲁迅的书有几本'
]

// 使用预设问题
function usePresetQuestion (question) {
  inputMessage.value = question
  sendMessage()
}

// 登出
function handleLogout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // 重定向到登录页面
  window.location.href = '/login'
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">📚 极简图书管理系统</h1>
        <div class="header-actions">
          <span class="user-info"
            >欢迎，{{ currentUser?.username || '用户' }}</span
          >
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
          <router-link to="/" class="btn btn-primary">返回首页</router-link>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="ai-chat-page">
          <h2 class="page-title">🤖 图书分析助手</h2>
          <div class="ai-chat-container">
            <div class="chat-messages">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[
                  'message',
                  message.isAI ? 'ai-message' : 'user-message'
                ]"
              >
                <div class="message-content">
                  <p class="message-text">{{ message.text }}</p>
                  <span class="message-time">{{ message.timestamp }}</span>
                </div>
              </div>

              <div v-if="loading" class="loading-message">
                <div class="loading-spinner"></div>
                <span>AI正在思考...</span>
              </div>
            </div>

            <div class="chat-input-container">
              <div class="preset-questions">
                <button
                  v-for="(question, index) in presetQuestions"
                  :key="index"
                  class="preset-btn"
                  @click="usePresetQuestion(question)"
                >
                  {{ question }}
                </button>
              </div>

              <div class="input-wrapper">
                <textarea
                  v-model="inputMessage"
                  class="chat-input"
                  placeholder="输入您的问题..."
                  rows="3"
                  @keydown="handleKeyDown"
                ></textarea>
                <button
                  class="send-btn"
                  :disabled="loading || !inputMessage.trim()"
                  @click="sendMessage"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.app-main {
  flex: 1;
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.ai-chat-page {
  width: 100%;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 32px;
  text-align: center;
}

.ai-chat-container {
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  height: 70vh;
  overflow: hidden;
}

.chat-header {
  padding: 20px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.chat-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 80%;
  display: flex;
}

.ai-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
}

.message-content {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  position: relative;
}

.ai-message .message-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top-left-radius: 0;
}

.user-message .message-content {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-hover)
  );
  color: white;
  border-bottom-right-radius: 0;
}

.message-text {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}

.user-message .message-text {
  color: white;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
  text-align: right;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  color: var(--text-secondary);
  font-size: 14px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.chat-input-container {
  padding: 20px;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.preset-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.preset-btn {
  padding: 8px 12px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  resize: none;
  font-size: 14px;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: border-color 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-hover)
  );
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .app-title {
    font-size: 20px;
  }

  .app-main {
    padding: 24px 0;
  }

  .container {
    padding: 0 16px;
  }

  .ai-chat-container {
    height: 80vh;
  }

  .message {
    max-width: 90%;
  }

  .preset-questions {
    gap: 6px;
  }

  .preset-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
