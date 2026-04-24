# Git Ai 提交代码神器

- 需求

  - 规范的 git 提交信息是很重要的
    - 项目的日志
    - 工作业绩的审核
    - 新手可以像高手一样高质量提交代码 (git 高级规范)

- 技术构成

  - 全栈项目
  - 前端 react + tailWindCss + axios
  - 后端 node express

- 前后端分离

  - server
    运行在服务器
    提供 api 接口，3000 伺服状态
    http://localhost:3000

  - frontend
    在用户的浏览器上运行(v8 引擎，js 运行的宿主)
    http://localhost:5173 Web

  - AI
    - ollama 部署开源大模型 deepseek-r1:8b resoning
    - 像 openai 一样的 api 接口
      :11434

## express

- node 老牌的敏捷开发框架
- app 后端应用
- listen 3000 端口伺服
- 后端路由 path
  网站本质是提供资源和服务的
  app.get('/hello',()=>{})
  http 是基于请求响应的简单协议(req,res)
  http://localhost:3000
  ip 找到服务器
  端口对应的是应用 express
  path /hello
  GET 资源的操作 CRUD
  req 请求对象
  res 响应对象

- apifox 测试 api 接口
- nodemon 边调试边开发
- express 默认不支持 req.body

  - 加一个 json 解析中间件
    请求 中间件 1，中间件 2... 响应

- GET 和 POST 有区别
  - GET 没有请求体
  - POST 有
- 中间件
  app.use(express.json())
- 响应头、响应体
  - 400 Bad Request 合适的状态码
  - 404 Not Found 资源不存在
  - 401 Unauthorized 未授权
  - 500 Internal Server Error 服务器错误
    1xx 100–199 信息性：请求已接收，继续处理
    2xx 200–299 成功：请求已成功处理
    3xx 300–399 重定向：需要进一步操作才能完成请求
    4xx 400–499 客户端错误：请求有误或无法完成
    5xx 500–599 服务器错误：服务器处理出错

## 跨域

有风险

- 跨域
  www.baidu.com(用户安全) -> www.dycom
  http://(协议)www.baidu.com(域名):5173(端口)
- 同源策略 CORS
  直接放弃请求 Cross Origin Resource Share
- 端口不一样 也会跨域 非常的严格
  协议 域名 端口 一样
  block 阻止请求
- 解决跨域 日常问题 -> 办护照

  - 前端发起跨域接口请求 (端口 port) 需要数据
  - 浏览器 用户小白www.baidu.com 同源策略 block 阻止请求
  - 后端 默认没有开启跨域的允许
    如果允许 就好像给我们前端特批了签证一样 浏览器放行
    .use(cors())
