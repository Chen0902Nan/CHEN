# 定时任务

明早9点，帮我把最新关于OpenClaw的新闻，整理成一篇报道，发到我的邮箱

- 日程安排的能力交给小龙虾
- 网络搜索tool
- 写文章
- 发邮件

## 生成器

普通函数 一调用就从头跑到尾
生成器函数 遇到一些yield停下来，promise解决后可以从暂停的地方继续跑
async await 的前身 也比较复杂

## RxJS

用数据流的方式来处理异步事件

- JS里常见的异步方式
  - callback 回调地狱
  - Promise
  - generator/yield
  - event listenner
  - async/await

以上是适合一次性的异步任务
有很多异步任务是连续发生的事件

- SSE
- 输入框输入
- 鼠标移动
- AI 流式

事件1 -> 事件2 -> 事件3 -> 事件4
像一条河流

## 流式输出

- nest.js + rxjs 实现服务器端sse接口
  - nest.js 以 @Sse装饰器模式 /ai/chat/stream
  - 本质是 设置了
    Content-Type:text/event-stream
    Cache-Control、Connection、Transfer-Encodig等
  - Service模块根据langchain 设置了stream:true
  - 使用rxjs from api 将llm 流式响应转成一个Observable对象
    pipe一下 再map转成前端需要的{data: chunk} 约定格式
  - service 使用langchain的tool 定义了 queryUserTool等tool
  - llm 流式大模型响应 for await chunk of stream
  - chunk 不断地concat合并
  - 判断fullAIMessageChunk.tool_call_chunks
    - 如果是，不干，
    - 如果不是，yield输出
  - agent loop
    - 如果要调用工具，执行tool(args)
  - 直到结束

dom 零级，dom 一级,dom 二级
冒泡机制

## Event Source

- html5的特性
  - 语义化标签 优化SEO搜索
  - video/audio 标签，哔哩哔哩
  - canvas 游戏和3d
  - 定位 Geolocation 可以拿到我们的经纬度 实现美团的点外卖
  - 表单的增强能力 placeholder占位符 required必填项 type='range' input的类型
  - localStorage/sessionStorage 本地存储
  - llm 流式输出能力 EventSource能力 自动接收服务器推送的文本数据流
  - Web Worker JS 多线程
  - WebSocket 双向通信 用的不是HTTP 可以广播(微信群)
  - 拖放 API
  - getUserMedia 摄像头 web直播/投屏
  - history API 前端路由

- ts 的Patial和Omit
  Partial可选 Omit排除
  partial:Partial<Omit<User,'id'>>
  应用场景：nestjs Patch 局部更新用户信息时，参数的数据校验

- 深化tool
  - query_user
    把tool作为provide 再module里声明，和原有的service解耦
    依赖注入的方式 model.bindTools()

## 邮件tool

- 邮件服务
  服务器 提供HTTP服务(WEB Server 3000 | Nginx 80) , 邮件服务，数据库服务（3306）rdjpnxricripdcid
  端口
  pnpm i nodemailer @nestjs-modules/mailer (nest 接入nodemailer,生态很好)
  - 发送内容是邮件，不是text/html
  - 传输？HTTP? QQ邮箱提供的SMTP  408

