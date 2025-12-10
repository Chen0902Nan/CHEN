// node 服务器端代码
// node 内置的http 模块
// require  模块化机制 node早期的 common.js 模块机制  旧的模块机制
// 大型项目中 分目录(mvc)，分文件(类)，一个项目不可能只是一个文件
// js 前段早期是没有模块化的 esm 才有（2015） 任务简单
// import esm 模块化方案
// no model -> node(全栈，commonjs) -> es6(esm 升级)
const http = require('http') //commonjs 模块化机制
const url = require('url') // url
// 数据
const users = [
  {
    id: 1,
    name: '舒俊',
    email: '123@qq.com'
  },
  {
    id: 2,
    name: '陈俊璋',
    email: '123@qq.com'
  },
  {
    id: 3,
    name: '徐行',
    email: '123@qq.com'
  }
]

function generateUserHTML (users) {
  // 模版字符窜 数据驱动
  const userRows = users
    .map(
      user => `
    <tr>
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    </tr>
    `
    )
    .join('')
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User List</title>
        <style>
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
        </style>
    </head>
    <body>
        <h1>Users</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${userRows}
            </tbody>
        </table>
    </body>
    </html>`
}

// req 用户请求
// res 响应对象
// http 是基于请求响应的简单协议
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  // console.log(parsedUrl)
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/users') {
    res.statusCode == 200 // 响应头 状态码
    res.setHeader('Content-Type', 'text/html;chatset=utf-8')
    const html = generateUserHTML(users)
    res.end(html)
  }
  // res.end('hello')
})
// server 伺服状态
server.listen(1314, () => {
  console.log('Server is running on port 1314')
})
