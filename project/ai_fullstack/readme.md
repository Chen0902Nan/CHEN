# AI 全栈项目

## 技能点

### react 全家桶

- react + typeScript(JS 超集)
- react-router-dom(前端路由)
- zustand(中央状态管理)
- axios(http 请求)

### 后端

- node + ts
- nest.js 企业级别后端开发框架
- psql
- redis 缓存数据库

### AI

- langchain
- coze/n8n/
- llm
- trae/cursor

## 项目安排

- frontend
- backend
- ai_server
- admin 后台管理系统

## react 全家桶

### react-router-dom

- 前端路由
  早期前端没有路由，路由由后端负责，前端是切图仔
  前后端分离 前端有独立的路由(html5)，实现页面切换
- 两种形式
  - HashRouter #/ 丑一点 很温柔 兼容性很好 锚点
  - BrowserRouter / 和后端路由一样 需要使用到 html5 history API 兼容不好 -> IE11 之前不兼容 现代的浏览器几乎都支持
- BrowserRouter as Router -> 增强代码可读性
- 性能 -> 快 页面组件的懒加载
  / Home 延迟一下 About 阻止加载
  首页为什么也设置懒加载？ -> 用户点击指定路由链接，跳过首页

### 路由有多少种呢

- 普通路由
- 动态路由 /product/:id
- 通配路由 \*
- 嵌套路由 Outlet
  <Outlet> 是 React Router DOM 中的组件，用于在父路由元素中渲染其子路由匹配到的内容。
- 鉴权路由(路由守卫) ProtectRoute
- 重定向路由 -> 使用 Naigate

### 路由生成访问历史

history 栈 先进后出
replace redirect 跳转 会替换掉当前的历史记录

### 单页应用

- 传统的开发是多页的 基于 http 请求，每次 url 发生改变后 去服务器重新请求整个页面
  体验不好，页面会白一下
- 单页面应用 react-router-dom html5 的 history
  引入前端路由
  路由改变后
  前端会收到一个事件，将匹配到的新路由显示在页面上
  
## git 操作

- 全新的实战项目
  git init
- 提交的时机
  每次完成一个相对独立的模块后，提交一次
  提交信息要准确完整
