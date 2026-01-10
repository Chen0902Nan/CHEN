<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Auth from './components/Auth.vue'

const router = useRouter()
const route = useRoute()

// 检查登录状态
function checkAuth () {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  return token && userStr
}

// 登录成功回调
function handleLoginSuccess (data) {
  // 登录成功后跳转到首页
  router.push('/')
}
</script>

<template>
  <div>
    <!-- 未登录：显示登录/注册界面 -->
    <Auth v-if="!checkAuth()" @login-success="handleLoginSuccess" />

    <!-- 已登录：显示路由视图 -->
    <router-view v-else />
  </div>
</template>
