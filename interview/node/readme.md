# 了解node 多少

相比于java/Go ， nodejs 借助于v8引擎在服务器端的，将js带到后端开发，
轻量(express/koa)高效(中间件)生态丰富，稳居大前端全栈(BFF层 Backend For Frontend)主流。
适合接口转发，实时通信，AI网关与管理后台升级，

node的特性是异步无阻塞，单线程高并发（单线程简单，I/O,网络请求等耗时任务，不会卡在那等待，放入event loop 立刻切换处理新需求，少量线程就能扛成千上万的并发连接），服务器开销是java的一半

我们对node的核心模块比较熟悉，比如fs文件模块 流式处理，path路径模块，http等模块
对node的事件循环、异步模型（Promise/async-await）有比较多的实操

在后端开发上，是基于restful思想做服务设计，熟悉mvc，分层。
最近在使用nestjs做后端开发，天然支持模块化和依赖注入。
数据库主要使用mysql和psql ,使用过prisma orm开发

我会基于langchain 做AI接口开发，比如封装了LLM调用，构建工具调用（tool），可以实现Agent开发流程
我写了一个RAG项目，了解文档切分，向量化、向量数据库存储、检索、增强过程，完成了对知识库的RAG，

我从node基础能力到nestsjs工程化及企业级开发，再到AI和Agent都有学习和项目经验，我相信可以较快速的加入公司的AI agent或openclaw 相关项目中

- readFile/writeFile promisify thenable 不用调用回调
  readFileSync 阻塞式
- fs.createReadStream pipe 流式输出

- BFF层
  mockjs/express/koa 前端自己做
  基于go/java 的接口，针对自己的业务做调整...

## nodejs event loop

- event loop 是JS的执行机制 ， node和前端的event loop 本质相同都是基于事件驱动的异步模型，但实现细节不同

- 前端（浏览器） 主要分为宏任务(script setTimeout)和微任务(promise)
  每轮循环先执行宏任务，再清空微任务队列，并去渲染更新或响应用户
  宏任务（script开始） -> 清空微任务队列 -> 下一轮
- nodejs(服务器，操作系统，文件系统，数据库) 更复杂1，事件循环
  分为多个阶段，timer（定时器），poll(文件，网络)，check（poll之后都会来检查），同时也有promise,process.nextTick微任务（属于每个阶段），
  timer(定时器) -> poil(轮询I/O，文件读取，网络，数据库) -> check(poil空闲结束后，强制进入此阶段核查执行) -> microtask 随阶段执行

check 只有一种任务：setImmediate() 注册的回调函数！

执行同步代码 -> 微任务（promise.then,process.nextTick(优先级更高)） -> timer -> poil(I/O) -> check(immediate)

node 偏 多阶段调度 ，前端更偏宏微任务模型

## node 事件循环机制

大致分为5个阶段，先执行代码中的同步代码，进入到timer阶段（定时器），再到poil阶段（I/O操作） ，再进入到check阶段，微任务（promise/process.nextTick）会在两个阶段之间执行，这里和我们的JS事件循环一样，执行完一个宏任务就清空微任务队列。
这里有一个关键点，poil和timer和check的复杂三角恋

- poil会根据最近的timer决定自己等待时间，如果poil为空，那么check又会一直催促
  有点抽象，
