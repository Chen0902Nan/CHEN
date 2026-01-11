<script setup>
import { ref, onMounted, computed } from 'vue'

const users = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingUser = ref(null)
const newUser = ref({
  username: '',
  email: '',
  role: 'user'
})

// 计算当前操作的用户对象
const currentUser = computed(() => {
  return editingUser.value || newUser.value
})

// 获取token
function getToken () {
  return localStorage.getItem('token')
}

// 获取用户列表
async function fetchUsers () {
  loading.value = true
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
      alert('获取用户列表失败：' + result.message)
    }
  } catch (error) {
    console.error('获取用户列表错误:', error)
    alert('网络错误：' + error.message)
  } finally {
    loading.value = false
  }
}

// 添加用户
async function addUser () {
  if (!newUser.value.username || !newUser.value.email) {
    alert('请填写完整信息')
    return
  }

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(newUser.value)
    })

    const result = await response.json()
    if (result.success) {
      fetchUsers()
      showForm.value = false
      newUser.value = { username: '', email: '', role: 'user' }
    } else {
      alert('添加用户失败：' + result.message)
    }
  } catch (error) {
    alert('网络错误：' + error.message)
  }
}

// 更新用户
async function updateUser () {
  if (!editingUser.value.username || !editingUser.value.email) {
    alert('请填写完整信息')
    return
  }

  try {
    const response = await fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(editingUser.value)
    })

    const result = await response.json()
    if (result.success) {
      fetchUsers()
      showForm.value = false
      editingUser.value = null
    } else {
      alert('更新用户失败：' + result.message)
    }
  } catch (error) {
    alert('网络错误：' + error.message)
  }
}

// 删除用户
async function deleteUser (id) {
  if (confirm('确定要删除这个用户吗？')) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })

      const result = await response.json()
      if (result.success) {
        fetchUsers()
      } else {
        alert('删除用户失败：' + result.message)
      }
    } catch (error) {
      alert('网络错误：' + error.message)
    }
  }
}

// 设置编辑用户
function setEditingUser (user) {
  editingUser.value = { ...user }
  showForm.value = true
}

// 登出
function handleLogout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">📚 极简图书管理系统</h1>
        <div class="header-actions">
          <span class="user-info"
            >欢迎，{{
              localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')).username
                : '用户'
            }}</span
          >
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
          <router-link to="/" class="btn btn-primary">图书管理</router-link>
          <router-link to="/borrow-return" class="btn btn-primary"
            >借还管理</router-link
          >
          <router-link to="/reports" class="btn btn-primary"
            >报表统计</router-link
          >
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="management-header">
          <h2 class="page-title">👥 用户管理</h2>
          <button class="btn btn-primary" @click="showForm = true">
            + 添加用户
          </button>
        </div>

        <!-- 用户列表 -->
        <div class="users-list">
          <div v-if="loading" class="loading">加载中...</div>

          <div v-else-if="users.length === 0" class="empty-state">
            <p>暂无用户数据</p>
          </div>

          <table v-else class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span
                    class="role-badge"
                    :class="user.role === 'admin' ? 'role-admin' : 'role-user'"
                  >
                    {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                  </span>
                </td>
                <td>{{ user.created_at || '-' }}</td>
                <td class="actions-cell">
                  <button
                    class="btn btn-secondary btn-sm"
                    @click="setEditingUser(user)"
                  >
                    编辑
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteUser(user.id)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 添加/编辑用户表单 -->
        <div v-if="showForm" class="form-overlay">
          <div class="form-modal">
            <h3>{{ editingUser ? '编辑用户' : '添加用户' }}</h3>

            <form @submit.prevent="editingUser ? updateUser() : addUser()">
              <div class="form-group">
                <label for="username">用户名</label>
                <input
                  id="username"
                  v-model="currentUser.username"
                  type="text"
                  class="input"
                  :placeholder="editingUser ? '编辑用户名' : '输入用户名'"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email">邮箱</label>
                <input
                  id="email"
                  v-model="currentUser.email"
                  type="email"
                  class="input"
                  :placeholder="editingUser ? '编辑邮箱' : '输入邮箱'"
                  required
                />
              </div>

              <div class="form-group">
                <label for="role">角色</label>
                <select id="role" v-model="currentUser.role" class="input">
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showForm = false"
                >
                  取消
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingUser ? '更新' : '添加' }}
                </button>
              </div>
            </form>
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

.users-list {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.users-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.role-admin {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.role-user {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}
</style>