# node 了解多少

相比于Java/Go node.js是借助于v8引擎在服务端，将js带到了后端开发
轻量(express/koa) 高效(中间件)生态丰富，稳居大前端全栈(BFF层 Backend For Frontend)主流，适合接口转发，是实时通信，微服务，AI网关与管理后台开发。

node的特性是单线程(异步无阻塞)，高并发(单线程简单，I/O，网络请求等耗时任务，不会卡在那等待，放入event loop，立刻切换处理新需求，少量线程就能扛成千上万的并发连接) 服务器开销相对java，只有一半。

我对node的核心模块比较熟悉，比如fs文件模块 流式处理(streamAble)、path路径模块、http等模块。对node的事件循环、异步模型(Promise/async-await) 有比较多的实操

在后端开发上，我基于restful API 思想做服务设计，熟悉MVC分层。最近在使用NestJS做后端开发，它天然支持模块化和依赖注入

- fs文件模块
- readFile/writeFile promisify thenable 不用回调
  readFileSync 阻塞式，同步读取文件
- fs.createReadStream(path[, options]) pipe 流式输出

- BFF层
  mockjs/express/koa 前端自己做
  基于go/java的接口 针对自己的业务做调整

-
