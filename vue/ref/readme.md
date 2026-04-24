# 响应式的诞生

# 响应式驱动界面的诞生

- 前后端分离
- ref 响应式数据 将数据包装成响应式对象
- 界面由{{}} v-for 进行数据驱动 template
- 聚焦于业务，数据的变化

## 纯后端的套模版

- mvc 开发模式

  - model 数据
    mysql 数据库抽象
  - view 模板
    html {{todos}}

  - controller 业务逻辑
    控制器 查询 model 数据
    渲染 view 模板
  - http 伺服
    req.url
    res.end('响应返回的内容')
    - html 静态部分
    - html 动态部分 有数据驱动

## 前后端分离

- 前端
  - html/css/js
  - ajax/fetch 主动的拉取数据
    http://127.0.0.1:5500/vue/ref/demo2/frontend/index.html
- 后端

  - 没有返回 html 返回的是是数据接口（api 服务）
  - 数据接口 api :3000/users
    后端数据接口：http://localhost:3000/users

- 优势 是开发人员解耦
  - 前端开发人员 只需要关注 数据的展示、用户体验
    DOM 编程 先找节点 -> 不是业务
    focus 业务 数据驱动界面
  - 后端开发人员 只需要关注 数据的处理、并发性能

## 响应式数据驱动

- 响应式数据**驱动**的界面 （template）
  {{}}
  跟在后端套模版的业务中来
- 前后端分离
