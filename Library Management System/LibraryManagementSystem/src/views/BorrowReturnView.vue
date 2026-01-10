<script setup>
import { ref, onMounted, computed } from 'vue'

const borrowings = ref([])
const books = ref([])
const users = ref([])
const loading = ref(false)
const showBorrowForm = ref(false)
const showReturnForm = ref(false)
const showBorrowHistory = ref(false)
const selectedBorrowing = ref(null)
const newBorrowing = ref({
  user_id: '',
  book_id: '',
  borrow_date: new Date().toISOString().split('T')[0],
  expected_return_date: ''
})
const searchQuery = ref('')
const filterStatus = ref('all')
const overdueOnly = ref(false)

// 获取token
function getToken() {
  return localStorage.getItem('token')
}

// 获取借阅记录
async function fetchBorrowings() {
  loading.value = true
  try {
    const response = await fetch('/api/borrowings', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const result = await response.json()

    if (result.success) {
      borrowings.value = result.data || []
    } else {
      alert('获取借阅记录失败：' + result.message)
    }
  } catch (error) {
    console.error('获取借阅记录错误:', error)
    alert('网络错误：' + error.message)
  } finally {
    loading.value = false
  }
}

// 获取图书列表
async function fetchBooks() {
  try {
    const response = await fetch('/api/books', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const result = await response.json()

    if (result.success) {
      books.value = result.data || []
    } else {
      console.error('获取图书列表失败：' + result.message)
    }
  } catch (error) {
    console.error('获取图书列表错误:', error)
  }
}

// 获取用户列表
async function fetchUsers() {
  try {
    const response = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const result = await response.json()

    if (result.success) {
      users.value = result.data || []
    } else {
      console.error('获取用户列表失败：' + result.message)
    }
  } catch (error) {
    console.error('获取用户列表错误:', error)
  }
}

// 借书
async function borrowBook() {
  if (!newBorrowing.value.user_id || !newBorrowing.value.book_id) {
    alert('请选择用户和图书')
    return
  }

  if (!newBorrowing.value.borrow_date) {
    alert('请选择借阅日期')
    return
  }

  try {
    const response = await fetch('/api/borrowings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(newBorrowing.value)
    })

    const result = await response.json()
    if (result.success) {
      fetchBorrowings()
      showBorrowForm.value = false
      newBorrowing.value = {
        user_id: '',
        book_id: '',
        borrow_date: new Date().toISOString().split('T')[0],
        expected_return_date: ''
      }
      alert('借书成功！')
    } else {
      alert('借书失败：' + result.message)
    }
  } catch (error) {
    alert('网络错误：' + error.message)
  }
}

// 还书
async function returnBook(borrowingId) {
  if (confirm('确定要归还这本书吗？')) {
    try {
      const response = await fetch(`/api/borrowings/${borrowingId}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      })

      const result = await response.json()
      if (result.success) {
        fetchBorrowings()
        alert('还书成功！')
      } else {
        alert('还书失败：' + result.message)
      }
    } catch (error) {
      alert('网络错误：' + error.message)
    }
  }
}

// 计算是否逾期
function isOverdue(expectedDate) {
  if (!expectedDate) return false
  const today = new Date()
  const expected = new Date(expectedDate)
  return expected < today
}

// 计算逾期天数
function getOverdueDays(expectedDate) {
  if (!expectedDate || !isOverdue(expectedDate)) return 0
  const today = new Date()
  const expected = new Date(expectedDate)
  const timeDiff = today.getTime() - expected.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// 计算罚款（每天1元）
function calculateFine(expectedDate) {
  const overdueDays = getOverdueDays(expectedDate)
  return overdueDays > 0 ? overdueDays * 1 : 0
}

// 过滤借阅记录
const filteredBorrowings = computed(() => {
  let result = borrowings.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(borrowing => 
      (borrowing.user?.username || '').toLowerCase().includes(query) ||
      (borrowing.book?.title || '').toLowerCase().includes(query) ||
      (borrowing.book?.author || '').toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filterStatus.value !== 'all') {
    if (filterStatus.value === 'active') {
      result = result.filter(borrowing => !borrowing.return_date)
    } else if (filterStatus.value === 'returned') {
      result = result.filter(borrowing => borrowing.return_date)
    } else if (filterStatus.value === 'overdue') {
      result = result.filter(borrowing => !borrowing.return_date && isOverdue(borrowing.expected_return_date))
    }
  }

  // 仅显示逾期
  if (overdueOnly.value) {
    result = result.filter(borrowing => !borrowing.return_date && isOverdue(borrowing.expected_return_date))
  }

  return result
})

// 获取图书信息
function getBookInfo(bookId) {
  return books.value.find(book => book.id === bookId) || {}
}

// 获取用户信息
function getUserInfo(userId) {
  return users.value.find(user => user.id === userId) || {}
}

// 显示借阅历史
function viewBorrowHistory(userId) {
  selectedBorrowing.value = borrowings.value.filter(b => b.user_id === userId)
  showBorrowHistory.value = true
}

// 查看用户历史
function viewUserHistory(userId) {
  selectedBorrowing.value = borrowings.value.filter(b => b.user_id === userId)
  showBorrowHistory.value = true
}

// 获取借阅中数量
function getActiveBorrowingsCount() {
  return borrowings.value.filter(b => !b.return_date).length
}

// 获取逾期数量
function getOverdueCount() {
  return borrowings.value.filter(b => !b.return_date && isOverdue(b.expected_return_date)).length
}

// 获取已归还数量
function getReturnedCount() {
  return borrowings.value.filter(b => b.return_date).length
}

// 登出
function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

onMounted(async () => {
  await Promise.all([fetchBorrowings(), fetchBooks(), fetchUsers()])
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">📚 极简图书管理系统</h1>
        <div class="header-actions">
          <span class="user-info">欢迎，{{ (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : '用户') }}</span>
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
          <router-link to="/" class="btn btn-primary">图书管理</router-link>
          <router-link to="/users" class="btn btn-primary">用户管理</router-link>
          <router-link to="/reports" class="btn btn-primary">报表统计</router-link>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="management-header">
          <h2 class="page-title">📖 借还管理</h2>
          <div class="header-buttons">
            <button class="btn btn-primary" @click="showBorrowForm = true">+ 借书</button>
          </div>
        </div>

        <!-- 搜索和过滤工具栏 -->
        <div class="filters-toolbar">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              class="input search-input"
              placeholder="搜索用户、图书名称或作者..."
            />
          </div>
          
          <div class="filter-options">
            <select v-model="filterStatus" class="input">
              <option value="all">全部状态</option>
              <option value="active">借阅中</option>
              <option value="returned">已归还</option>
              <option value="overdue">已逾期</option>
            </select>
            
            <label class="checkbox-label">
              <input 
                v-model="overdueOnly" 
                type="checkbox" 
              />
              仅显示逾期
            </label>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-number">{{ borrowings.length }}</span>
            <span class="stat-label">总记录</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" :class="getActiveBorrowingsCount() > 0 ? 'highlight' : ''">{{ getActiveBorrowingsCount() }}</span>
            <span class="stat-label">借阅中</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" :class="getOverdueCount() > 0 ? 'warning' : ''">{{ getOverdueCount() }}</span>
            <span class="stat-label">逾期</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getReturnedCount() }}</span>
            <span class="stat-label">已归还</span>
          </div>
        </div>

        <!-- 借还记录列表 -->
        <div class="borrowings-list">
          <div v-if="loading" class="loading">加载中...</div>
          
          <div v-else-if="filteredBorrowings.length === 0" class="empty-state">
            <p>暂无借阅记录</p>
          </div>

          <table v-else class="borrowings-table">
            <thead>
              <tr>
                <th>用户</th>
                <th>图书</th>
                <th>借阅日期</th>
                <th>预计归还</th>
                <th>实际归还</th>
                <th>逾期天数</th>
                <th>罚款</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="borrowing in filteredBorrowings" 
                :key="borrowing.id" 
                :class="{'overdue-row': !borrowing.return_date && isOverdue(borrowing.expected_return_date)}"
              >
                <td>
                  <div class="user-info-cell">
                    <span>{{ borrowing.user?.username || '未知用户' }}</span>
                    <small class="user-email">{{ borrowing.user?.email }}</small>
                  </div>
                </td>
                <td>
                  <div class="book-info-cell">
                    <strong>{{ borrowing.book?.title || '未知图书' }}</strong>
                    <small>{{ borrowing.book?.author }}</small>
                  </div>
                </td>
                <td>{{ borrowing.borrow_date }}</td>
                <td>{{ borrowing.expected_return_date }}</td>
                <td>{{ borrowing.return_date || '-' }}</td>
                <td>
                  <span v-if="!borrowing.return_date && isOverdue(borrowing.expected_return_date)" class="overdue-days">
                    {{ getOverdueDays(borrowing.expected_return_date) }} 天
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="!borrowing.return_date && isOverdue(borrowing.expected_return_date)" class="fine-amount">
                    ¥{{ calculateFine(borrowing.expected_return_date) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span 
                    class="status-badge" 
                    :class="borrowing.return_date ? 'status-returned' : (isOverdue(borrowing.expected_return_date) ? 'status-overdue' : 'status-borrowed')"
                  >
                    {{ borrowing.return_date ? '已归还' : (isOverdue(borrowing.expected_return_date) ? '已逾期' : '借阅中') }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button 
                    v-if="!borrowing.return_date" 
                    class="btn btn-warning btn-sm" 
                    @click="returnBook(borrowing.id)"
                  >
                    归还
                  </button>
                  <button 
                    class="btn btn-secondary btn-sm" 
                    @click="viewUserHistory(borrowing.user_id)"
                  >
                    历史
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 借书表单 -->
        <div v-if="showBorrowForm" class="form-overlay">
          <div class="form-modal">
            <h3>借书登记</h3>
            
            <form @submit.prevent="borrowBook">
              <div class="form-group">
                <label for="user-select">选择用户</label>
                <select 
                  id="user-select" 
                  v-model="newBorrowing.user_id" 
                  class="input"
                  required
                >
                  <option value="">请选择用户</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.username }} ({{ user.email }})
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="book-select">选择图书</label>
                <select 
                  id="book-select" 
                  v-model="newBorrowing.book_id" 
                  class="input"
                  required
                >
                  <option value="">请选择图书</option>
                  <option 
                    v-for="book in books.filter(b => b.status === '在馆')" 
                    :key="book.id" 
                    :value="book.id"
                  >
                    {{ book.title }} - {{ book.author }} ({{ book.status }})
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="borrow-date">借阅日期</label>
                <input 
                  id="borrow-date" 
                  v-model="newBorrowing.borrow_date" 
                  type="date" 
                  class="input" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="expected-return">预计归还日期</label>
                <input 
                  id="expected-return" 
                  v-model="newBorrowing.expected_return_date" 
                  type="date" 
                  class="input"
                />
                <small class="help-text">建议7-30天内归还</small>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showBorrowForm = false">取消</button>
                <button type="submit" class="btn btn-primary">确认借书</button>
              </div>
            </form>
          </div>
        </div>

        <!-- 借阅历史弹窗 -->
        <div v-if="showBorrowHistory" class="form-overlay">
          <div class="history-modal">
            <div class="modal-header">
              <h3>用户借阅历史</h3>
              <button class="btn-close" @click="showBorrowHistory = false">×</button>
            </div>
            <div class="history-content">
              <div v-if="selectedBorrowing && selectedBorrowing.length > 0">
                <table class="history-table">
                  <thead>
                    <tr>
                      <th>图书</th>
                      <th>借阅日期</th>
                      <th>预计归还</th>
                      <th>实际归还</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in selectedBorrowing" :key="record.id">
                      <td>{{ record.book?.title || '未知图书' }}</td>
                      <td>{{ record.borrow_date }}</td>
                      <td>{{ record.expected_return_date }}</td>
                      <td>{{ record.return_date || '-' }}</td>
                      <td>
                        <span class="status-badge" :class="record.return_date ? 'status-returned' : (isOverdue(record.expected_return_date) ? 'status-overdue' : 'status-borrowed')">
                          {{ record.return_date ? '已归还' : (isOverdue(record.expected_return_date) ? '已逾期' : '借阅中') }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="empty-state">
                <p>该用户暂无借阅历史</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.filters-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
}

.filter-options {
  display: flex;
  gap: 12px;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-primary);
}

.checkbox-label input {
  margin: 0;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-number.highlight {
  color: #ef6c00;
}

.stat-number.warning {
  color: #c62828;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.borrowings-list {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
}

.borrowings-table {
  width: 100%;
  border-collapse: collapse;
}

.borrowings-table th,
.borrowings-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.borrowings-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.borrowings-table tbody tr:hover {
  background-color: var(--bg-secondary);
}

.overdue-row {
  background-color: #fff8f8 !important;
}

.user-info-cell, .book-info-cell {
  display: flex;
  flex-direction: column;
}

.user-info-cell small,
.book-info-cell small {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 2px;
}

.overdue-days, .fine-amount {
  font-weight: 600;
  color: #c62828;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-borrowed {
  background-color: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffe0b2;
}

.status-returned {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-overdue {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 24px;
  width: 90%;
  max-width: 500px;
}

.history-modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.history-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.history-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group .help-text {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-sm, .btn-warning {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
}
</style>