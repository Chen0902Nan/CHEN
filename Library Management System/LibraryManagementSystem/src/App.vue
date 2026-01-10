<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Auth from './components/Auth.vue'

const router = useRouter()
const route = useRoute()

// 响应式的登录状态
const isLoggedIn = ref(false)

// 检查登录状态
function checkAuth () {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  isLoggedIn.value = token && userStr
  return isLoggedIn.value
}

// 组件挂载时检查登录状态
onMounted(() => {
  checkAuth()
})

// 登录成功回调
function handleLoginSuccess (data) {
  // 更新登录状态
  isLoggedIn.value = true
  // 登录成功后跳转到首页
  router.push('/')
}
</script>

<template>
  <div>
    <!-- 未登录：显示登录/注册界面 -->
    <Auth v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

    <!-- 已登录：显示路由视图 -->
    <router-view v-else />
  </div>
</template>
