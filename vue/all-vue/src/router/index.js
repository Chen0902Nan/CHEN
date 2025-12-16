// router 模块 定义路由
import{
  createRouter,//前端路由实例
  createWebHashHistory// 路由模式
}from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
const routes=[
  {
    path:'/',
    name:'Home',
    component:Home
  },
   {
    path:'/about',
    name:'About',
    component:About
  }
]
// 实例化 前端路由
const router =createRouter({
  // 访问历史 hash 路由 #/about
  history:createWebHashHistory(),
  // 路由配置数组
  routes
})
export default router