## 如何实现的流式输出

- 在这个项目里，我用 NestJS + SSE + RxJS + LangChain 流式接口 实现了 AI 的流式输出。核心目标是：模型一边生成，前端一边展示，而不是等整段回答生成完再一次性返回，这样用户会感觉响应更快、交互体验更自然，从而达到优化用户体验的目的。

工厂模式 useFactory

- 具体实现上，Service 层调用 LangChain 的 .stream() 方法，而不是 .invoke()。
  .stream() 会把模型输出按 chunk 逐步返回，我通过 for await...of 持续读取这些 chunk，通过\*function 声明一个生成器函数，
  对不是工具调用的chunk通过yiedl传递给前端

- 如果是普通聊天模型，我会直接提取文本内容；如果是 Agent / Tool Calling 场景，流里可能夹杂工具调用相关的 chunk，比如 tool_call_chunks，这时候我会先做过滤，只把真正需要展示给用户的文本片段继续往前传。

- 在接口层，NestJS 使用装饰器模式装饰器模式是经典的面相对象设计模式之一，通过 @Sse() 暴露 SSE 接口。因为 NestJS 的 SSE 返回值通常是 Observable，所以我会通过 RxJS 的 from() 把异步流转换成 Observable，再通过 pipe(map(...)) 包装成 SSE 规范需要的 { data: xxx } 格式，持续推送给前端。

- 前端则使用浏览器原生的 EventSource 建立 SSE 长连接，监听 onmessage 事件。每收到一个新的 chunk，就把它 append 到当前回答中，这样就实现了“边生成边显示”的效果。

### 异常处理

对于流结束、异常中断、前端关闭连接这些边界情况，我会把一次流式回答当成一个完整生命周期来处理。
正常结束时，后端会发送一个明确的 done 事件，再关闭流；前端收到 done 后主动关闭 EventSource，避免自动重连。
异常中断时，后端用 try/catch 捕获错误，记录日志，并通过 error 事件通知前端，前端保留已收到的 partial answer，同时提示用户重试。
当前端主动关闭连接、页面卸载或者用户点击停止生成时，前端会调用 EventSource.close()，后端通过监听 req.close 事件中止上游 LLM 请求，并释放订阅和资源，避免无效计算和连接泄漏。

正常结束发 done，异常中断发 error，前端关闭就 abort 上游请求并清理资源。

```
function CloseEventSource() {
if (es) {
es.close();
es = null;
}
sendBtn.disabled = false;
}
window.addEventListener('beforeunload', CloseEventSource);
```

### SSE 和 WebSocket的区别

- sse和websocket都是解决服务器主动向客户端推送数据的技术，但他们的定位，实现机制以及适应场景有明显的区别

- 通信方式上

1. sse是建立在http协议上的，只能由服务端向客户端推送数据，如果客户端想要向服务端发送数据，需要通过http的post请求
2. websocket 是建立在TCP之上的双工协议请求，连接建立后，双方可以在同一个连接上自由的进行全双工通信

- 协议与连接机制

1. sse使用的是标准的http请求，他利用了http长连接的特性，通过Content-Type:text/event-stream告诉浏览器这是一个流式响应，天生适合做llm流式输出
2. websocket是一个独立的协议(ws://或者wss://)，他通过HTTP的Upgrade机制进行握手，将协议升级为websocket：前端通过const ws=new WebSocket("url")发送协议升级请求 状态码为101,后端通过koa-websocket库拦截请求完成协议升级，是一个长连接的TCP通道

- 特性

1. sse有自动重连机制，是浏览器原生支持的，断开后会自动尝试重连
2. sse只支持纯文本，websocket支持传输文本+二进制
3. sse不支持IE浏览器，支持现代浏览器。websocket支持现代浏览器

#### 应用场景

##### 为什么SSE适合LLM

- 协议的完美契合
  LLM的生成过程本质上就是一个流式数据生产的过程，模型是一个字一个字的吐出token

1. SSE是天然的流式协议，他最核心的就是响应头中的Content-Type:text/event-stream,它允许服务端在一次HTTP请求中，源源不断地向客户端推送数据块，符合LLM的流式数据生产的过程
