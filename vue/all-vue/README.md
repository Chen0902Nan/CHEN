# 现代前端开发**工程化**

- npm init vite
  vite?
  vue 作者 尤雨溪开发的现代前端**构建**工具，他利用浏览器原神 ES 模块实现极速的冷启动和**热更新**，大幅度提升开发体验
  - 得到一个比较标准的项目开发模版
    优秀的架构

## 优秀的架构

- vite 会将根目录下的 index.html 作为首页启动
  # root 组件的挂载点
  App.vue 根组件
- vite 为了构建，是具体业务开发之前的基石

  - 返回了项目开发的模版
  - npm install 装依赖
    package.json
    vite 构建的大管家
    - 开发的是前端项目 vue3 src/前端开发目录
    - vite 是基于 node 的，
      npm install vite
      npm run dev
    - localhost:5173 启动项目
    - 自动打开浏览器 node 操作 OS
    - 热更新 监听任何文件修改，浏览器会自动刷新

- src/前端开发目录

  - main.js 入口文件
  - App.vue 根组件
  - style.css 全局样式
  - components/ 组件目录

- Volar 是 vue 官方的 VS Code 插件，提供了 Vue 3 语法的智能提示和代码补全功能
- Vue devtool chrome 插件

## 多个页面？

vue- router
npm i vue-router

- 配置路由
- 新建页面
  views/
- 切换
