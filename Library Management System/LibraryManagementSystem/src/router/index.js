import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AIChatView from '../views/AIChatView.vue'
import Auth from '../components/Auth.vue'
import UserManagementView from '../views/UserManagementView.vue'
import BorrowReturnView from '../views/BorrowReturnView.vue'
import ReportsView from '../views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ai',
      name: 'ai-chat',
      component: AIChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagementView,
      meta: { requiresAuth: true }
    },
    {
      path: '/borrow-return',
      name: 'borrow-return',
      component: BorrowReturnView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Auth
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      // 已登录，继续导航
      next()
    } else {
      // 未登录，重定向到登录页面
      next({ name: 'login' })
    }
  } else {
    // 不需要认证的路由，直接导航
    next()
  }
})

export default router
