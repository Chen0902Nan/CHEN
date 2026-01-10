<script setup>
import { ref, onMounted } from 'vue'

const reports = ref({
  totalBooks: 0,
  availableBooks: 0,
  borrowedBooks: 0,
  totalUsers: 0,
  totalBorrowings: 0,
  overdueBorrowings: 0,
  popularBooks: [],
  monthlyStats: []
})

const loading = ref(false)

// 获取token
function getToken() {
  return localStorage.getItem('token')
}

// 获取统计报告
async function fetchReports() {
  loading.value = true
  try {
    // 获取图书统计
    const booksResponse = await fetch('/api/books/stats', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const booksResult = await booksResponse.json()
    
    if (booksResult.success) {
      reports.value.totalBooks = booksResult.data.total || 0
      reports.value.availableBooks = booksResult.data.available || 0
      reports.value.borrowedBooks = booksResult.data.borrowed || 0
    }

    // 获取用户统计
    const usersResponse = await fetch('/api/users/stats', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const usersResult = await usersResponse.json()
    
    if (usersResult.success) {
      reports.value.totalUsers = usersResult.data.total || 0
    }

    // 获取借阅统计
    const borrowingsResponse = await fetch('/api/borrowings/stats', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const borrowingsResult = await borrowingsResponse.json()
    
    if (borrowingsResult.success) {
      reports.value.totalBorrowings = borrowingsResult.data.total || 0
      reports.value.overdueBorrowings = borrowingsResult.data.overdue || 0
    }

    // 获取热门图书
    const popularResponse = await fetch('/api/books/popular', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const popularResult = await popularResponse.json()
    
    if (popularResult.success) {
      reports.value.popularBooks = popularResult.data || []
    }

    // 获取月度统计
    const monthlyResponse = await fetch('/api/reports/monthly', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const monthlyResult = await monthlyResponse.json()
    
    if (monthlyResult.success) {
      reports.value.monthlyStats = monthlyResult.data || []
    }
  } catch (error) {
    console.error('获取统计数据错误:', error)
    alert('获取统计数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 登出
function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

onMounted(() => {
  fetchReports()
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
          <router-link to="/borrow-return" class="btn btn-primary">借还管理</router-link>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <h2 class="page-title">📊 报表统计</h2>

        <div v-if="loading" class="loading">加载中...</div>
        
        <div v-else class="reports-container">
          <!-- 统计卡片 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-info">
                <h3>{{ reports.totalBooks }}</h3>
                <p>图书总数</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ reports.availableBooks }}</h3>
                <p>在馆图书</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📖</div>
              <div class="stat-info">
                <h3>{{ reports.borrowedBooks }}</h3>
                <p>借出图书</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ reports.totalUsers }}</h3>
                <p>用户总数</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🔄</div>
              <div class="stat-info">
                <h3>{{ reports.totalBorrowings }}</h3>
                <p>借阅总数</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-info">
                <h3>{{ reports.overdueBorrowings }}</h3>
                <p>逾期数量</p>
              </div>
            </div>
          </div>

          <!-- 热门图书 -->
          <div class="report-section">
            <h3 class="section-title">🔥 热门图书 Top 5</h3>
            <div class="popular-books">
              <div 
                v-for="(book, index) in reports.popularBooks" 
                :key="book.id" 
                class="popular-book-item"
              >
                <span class="rank">#{{ index + 1 }}</span>
                <div class="book-info">
                  <h4>{{ book.title }}</h4>
                  <p>{{ book.author }}</p>
                </div>
                <div class="borrow-count">{{ book.borrow_count || 0 }} 次借阅</div>
              </div>
              
              <div v-if="reports.popularBooks.length === 0" class="empty-state">
                <p>暂无热门图书数据</p>
              </div>
            </div>
          </div>

          <!-- 月度统计 -->
          <div class="report-section">
            <h3 class="section-title">📈 月度借阅统计</h3>
            <div class="monthly-stats">
              <div 
                v-for="stat in reports.monthlyStats" 
                :key="stat.month" 
                class="month-stat-item"
              >
                <div class="month-label">{{ stat.month }}</div>
                <div class="stat-bar-container">
                  <div 
                    class="stat-bar" 
                    :style="{ width: `${Math.min(100, stat.count * 10)}%` }"
                  ></div>
                  <span class="stat-count">{{ stat.count }} 次</span>
                </div>
              </div>
              
              <div v-if="reports.monthlyStats.length === 0" class="empty-state">
                <p>暂无月度统计数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  color: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-info h3 {
  font-size: 28px;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.stat-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.report-section {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.popular-books {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popular-book-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.popular-book-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.rank {
  font-weight: bold;
  color: var(--primary-color);
  margin-right: 12px;
  min-width: 30px;
}

.book-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.book-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.borrow-count {
  margin-left: auto;
  font-weight: 500;
  color: var(--primary-color);
}

.monthly-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.month-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-label {
  min-width: 80px;
  font-weight: 500;
  color: var(--text-primary);
}

.stat-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-bar {
  height: 20px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-color-dark));
  border-radius: 10px;
  min-width: 40px;
  transition: width 0.3s ease;
}

.stat-count {
  font-weight: 500;
  color: var(--text-primary);
  min-width: 60px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: var(--text-secondary);
}
</style>