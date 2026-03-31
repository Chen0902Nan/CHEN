# 字节面试题

## webSocket 和 SSE 区别

- 面试官心理
  - SSE 是llm流式输出，当下的业务热点
  - 408 计算机网络 协议底层的理解
  - 类比
    共同点 实时推送数据的长连接
  - 前端比较熟悉的是http协议 跨协议开发的经验
  - webSocket 是HTML5 的用于即使通讯(不管用户在不在线，我都可以给他发消息)
    用于聊天，通讯等场景 Socket协议 QQ Weixin 一些端游
    Client/Server 架构 实时通讯
    QQ Weixin 不是Web架构，是B/S架构 浏览器

## WebSocket

- Web + Socket
  Socket 基于tcp/ip 的实时通讯双工(双方都可以发送接收)协议
  Web + html5 提供的新特性 在Web端也可以实时通讯
  WebSocket 是一种在浏览器端和服务器之间的建立长连接的协议，可以实现双向实时通信

### 项目的需求分析

chat-app 聊天应用

- http协议不适合
  基于请求、响应的，一次请求，一次响应
  要想获得最新的聊天内容，需要重新访问服务器(刷新页面)

- SSE 也不适合
  服务器端推送，单向持续推送 没办法做到用户端持续推送
  只适合用户和llm聊天,prompt一次，llm流式输出多次

- socket协议
  - 双工协议
  - 实时收消息
  - 实时发消息
  - 多人同步
  - 如果基于http协议，可以实时通讯吗？
    一定要遵守拿新内容，就一定得走服务器
    fetch/ajax dom动态更新
    使用轮询，每隔多少时间就请求一次 setInterval() 但是性能很差且比较复杂
    http + loop ajax 可以实现类似聊天的功能
  - WebSocket 一次连接，持续通讯
    服务器端和客户端都可以主动推送
  - WebSocket 细节
    - koa + koa-websocket
    - new Koa() listen 3000
    - app.use(middleware) 中间件就是一个函数
    - ctx 是请求响应上下文，
    - 第一次和服务器的通信其实用的是http协议，拿到页面
    - 之后就是socket协议
      client new WebSocket('ws://localhost:3000/ws')
    - 消息机制 实时通讯(广播,服务器维护了连接数组)
      on
      send
    - 101 switch protocol
      new WebSocket() 之后，切花成 socket 协议

- 基于请求 + 响应的http是短连接，是要断开的
  keepAlive 不断开，其他的同域资源可以复用通道
  http 2.0 多路复用 tcp/ip 连接是有开销的

- WebSocket 长连接 (持久化双向通道)

- SSE 长连接(持久化单向通道)

- 通信方式上
  SSE,http 都是单向的，仅服务端向客户端推送
  WebSocket 是双向的(双全工，客户端和服务端均可主动发送)

- 数据格式上
  http没有限制(文本，二级制，JSON等，只要响应头content-Teype设置)
  WebSocekt 二进制或文本帧
  SSE 仅限文本(通常为JSON或纯文本)

- 协议类型
  HTTP/1.1 HTTP/2 HTTP/3
  WebSocket 协议(ws://或者wss://)
  SSE 基于http协议(text/event-stream)

- 浏览器兼容性
  HTTP 完美支持所有浏览器
  WS支持所有现代浏览器
  SSE不支持IE浏览器，现代浏览器支持 (流式输出传统做法：fetch + readStream blob)

## 介绍心跳机制

客户端和服务器端互相报平安，用来检测连接是否活着
打个比方：异地恋两个人打电话
你在吗？心跳
为什么要心跳？ 因为WebSocket/SSE 是长连接

- 网络断了
- 用户掉线
- 必须主动的去监测连接状态 ping/pong 心跳机制的测试
- 实现的方式
  - 客户端发送
  - setInterval(()=>{
    ws.send(JSON.stringigy({type:'ping'}))
    },30000)
  - 服务器端收到
    if(msg.type===ping){
    wx.send(JSON.stringify({type:'pong'}))
    }

  三步
  - 定时发送ping
  - 接收响应pong
  - 超时判断 + 重连机制

## 了解SSR吗？

- CSR
  Clietn Side Render
  致命缺点：对SEO不友好(爬虫只能爬取服务端传出的内容)，只有一个#root挂载点
  先返回一个空壳的HTML(#root)，由浏览器通过JS渲染页面
  优点是交互流畅(路由，单页面应用SPA,局部更新，无刷新交互，避免了页面重载)
  前后端分离(mockjs+SPA+zustand)
  缺点也很明显：首屏加载慢(CSR 需要下载解析JS，并请求api数据后渲染，过程串行阻塞，导致首屏白屏时间比较长，相对于ssr 服务器端编译和取数据)
  路由懒加载+骨架屏
  SEO不友好，因为开始的时候HTML几乎没有内容

- SSR
  Server Side Render
  react js node运行
  react component state + jsx node 运行
  事件、生命周期等到时候再在前端运行

  SSR 是指React在服务器端将组件和数据渲染为完整的HTML字符串后再返回给浏览器
  Hydration/水合：把静态页面变成可交互的页面
  拿着已有的HTML，让JS重新跑一遍，把点击事件等粘在页面上，变成一个可交互的页面
  SSR的优点是首屏加载快，SEO好，缺点是服务器压力大，开发复杂度高，

- 业务场景的选择
  CSR适合做后台管理系统(自己人用，没有SEO需求)、强交互应用(canvas,工作流)、ios/android(原生做壳子,硬件支持 拍照、蓝牙、陀螺仪，性能要求极高，要做两套) 很多页面是用WebView(都是用的Chrome内核)
  移动端时代流量的入口不再是百度的搜索引擎

### 手写SSR

- express httpserver
- vite擅长react工程化
  - fs.readFileSync(index.html)
  - transFormIndexHtml，
  - vite.ssrLoadModule /src/entry-server.jsx
  - 调用render方法 得到组件html字符串 替换标记

- react
  服务器端运行 编写各个组件
  react-dom/server 提供了一个renderToString方法
  react-dom.client 提供了hydrateRoot 水合
- App.jsx 组件本身
- entry-server.jsx
  提供了render方法，供server.js调用
  不会执行事件监听等前端任务
- entry-client.jsx
  调用react-dom/client hydrateRoot 水合一下
  将服务端返回的静态页面变成动态的可交互的页面

- 水合就是浏览器把服务端生成的HTML“接管”过来，React再跑一遍对比结构，不重建DOM，只绑定事件和状态，让页面变成可交互。

- SSR开发框架 next.js
