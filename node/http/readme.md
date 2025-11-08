- node 搭建一个 http 服务器

- 简单的后端代码
  import http from 'http'

  http.createServer((req,res)={
  // callBack 处理用户请求
  // req 请求体
  // res 响应体
  res.end('Hello World')

  }).listen(3000) // localhost:3000
