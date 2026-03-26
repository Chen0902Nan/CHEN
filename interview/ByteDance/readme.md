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
