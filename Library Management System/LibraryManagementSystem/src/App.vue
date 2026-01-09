<script setup>
import { ref, onMounted, watch } from 'vue'
import BookList from './components/BookList.vue'
import BookForm from './components/BookForm.vue'
import Auth from './components/Auth.vue'

const isAuthenticated = ref(false)
const user = ref(null)
const books = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingBook = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// 检查登录状态
function checkAuth () {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  if (token && userStr) {
    isAuthenticated.value = true
    user.value = JSON.parse(userStr)
    return true
  }
  return false
}

// 获取token
function getToken () {
  return localStorage.getItem('token')
}

// 登出
function handleLogout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  user.value = null
  books.value = []
}

// 登录成功回调
function handleLoginSuccess (data) {
  isAuthenticated.value = true
  user.value = data.user
  fetchBooks(1)
}

// 获取图书列表
async function fetchBooks (page = 1) {
  loading.value = true
  try {
    const url = `/api/books?search=${encodeURIComponent(
      searchQuery.value
    )}&page=${page}&limit=10`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const result = await response.json()

    // 如果token过期，自动登出
    if (result.message && result.message.includes('令牌')) {
      handleLogout()
      return
    }

    if (result.success) {
      books.value = result.data || []
      // 确保分页信息正确设置
      if (result.pagination) {
        pagination.value = {
          page: result.pagination.page || page,
          limit: result.pagination.limit || 10,
          total: result.pagination.total || 0,
          totalPages:
            result.pagination.totalPages ||
            Math.ceil(
              (result.pagination.total || 0) / (result.pagination.limit || 10)
            )
        }
      }
      currentPage.value = page
    } else {
      alert('获取图书列表失败：' + result.message)
    }
  } catch (error) {
    console.error('获取图书列表错误:', error)
    alert('网络错误：' + error.message)
  } finally {
    loading.value = false
  }
}

// 监听搜索关键词变化，重置到第一页并搜索
watch(searchQuery, () => {
  currentPage.value = 1
  fetchBooks(1)
})

// 切换页码
function handlePageChange (page) {
  fetchBooks(page)
}

// 打开新增表单
function handleAdd () {
  editingBook.value = null
  showForm.value = true
}

// 打开编辑表单
function handleEdit (book) {
  editingBook.value = book
  showForm.value = true
}

// 关闭表单
function handleCloseForm () {
  showForm.value = false
  editingBook.value = null
}

// 提交表单（新增或编辑）
async function handleSubmit (formData) {
  try {
    const url = editingBook.value
      ? `/api/books/${editingBook.value.id}`
      : '/api/books'

    const method = editingBook.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(formData)
    })

    // 如果token过期，自动登出
    if (response.status === 401 || response.status === 403) {
      handleLogout()
      return
    }

    const result = await response.json()

    if (result.success) {
      handleCloseForm()
      fetchBooks(currentPage.value)
    } else {
      alert('操作失败：' + result.message)
    }
  } catch (error) {
    alert('网络错误：' + error.message)
  }
}

// 删除图书
async function handleDelete (id) {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })

    // 如果token过期，自动登出
    if (response.status === 401 || response.status === 403) {
      handleLogout()
      return
    }

    const result = await response.json()

    if (result.success) {
      // 如果当前页只有一本书，删除后应该跳转到上一页
      // 先获取当前数据，判断是否需要调整页码
      const targetPage =
        books.value.length === 1 && currentPage.value > 1
          ? currentPage.value - 1
          : currentPage.value
      fetchBooks(targetPage)
    } else {
      alert('删除失败：' + result.message)
    }
  } catch (error) {
    alert('网络错误：' + error.message)
  }
}

// 组件挂载时检查登录状态
onMounted(() => {
  if (checkAuth()) {
    fetchBooks(1)
  }
})
</script>

<template>
  <!-- 未登录：显示登录/注册界面 -->
  <Auth v-if="!isAuthenticated" @login-success="handleLoginSuccess" />

  <!-- 已登录：显示主应用 -->
  <div v-else class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">📚 极简图书管理系统</h1>
        <div class="header-actions">
          <span class="user-info">欢迎，{{ user?.username }}</span>
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
          <button class="btn btn-primary" @click="handleAdd">+ 新增图书</button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <BookList
          :books="books"
          :loading="loading"
          :pagination="pagination"
          :current-page="currentPage"
          v-model:search-query="searchQuery"
          @edit="handleEdit"
          @delete="handleDelete"
          @page-change="handlePageChange"
        />
      </div>
    </main>

    <BookForm
      :book="editingBook"
      :show="showForm"
      @close="handleCloseForm"
      @submit="handleSubmit"
    />
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
  max-width: 1200px;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

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
}
</style>
