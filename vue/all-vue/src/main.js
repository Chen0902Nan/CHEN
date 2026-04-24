// vue  createApp 创建一个App
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 引入路由模块


// 现代前端应用
// 组件化，响应式...
// 根DOM编程 say babye
createApp(App)
.use(router) // 启用路由
// 挂载 在qpp上
.mount('#app')
