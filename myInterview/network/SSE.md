## 如何实现的流式输出

- 在这个项目里，我用 NestJS + SSE + RxJS + LangChain 流式接口 实现了 AI 的流式输出。核心目标是：模型一边生成，前端一边展示，而不是等整段回答生成完再一次性返回，这样用户会感觉响应更快、交互体验更自然，从而达到优化用户体验的目的。

工厂模式 useFactory

- 具体实现上，Service 层调用 LangChain 的 .stream() 方法，而不是 .invoke()。
  .stream() 会把模型输出按 chunk 逐步返回，我通过 for await...of 持续读取这些 chunk。

- 如果是普通聊天模型，我会直接提取文本内容；如果是 Agent / Tool Calling 场景，流里可能夹杂工具调用相关的 chunk，比如 tool_call_chunks，这时候我会先做过滤，只把真正需要展示给用户的文本片段继续往前传。

- 在接口层，NestJS 使用装饰器模式装饰器模式是经典的面相对象设计模式之一，通过 @Sse() 暴露 SSE 接口。因为 NestJS 的 SSE 返回值通常是 Observable，所以我会通过 RxJS 的 from() 把异步流转换成 Observable，再通过 pipe(map(...)) 包装成 SSE 规范需要的 { data: xxx } 格式，持续推送给前端。

- 前端则使用浏览器原生的 EventSource 建立 SSE 长连接，监听 onmessage 事件。每收到一个新的 chunk，就把它 append 到当前回答中，这样就实现了“边生成边显示”的效果。

### 异常处理

对于流结束、异常中断、前端关闭连接这些边界情况，我会把一次流式回答当成一个完整生命周期来处理。
正常结束时，后端会发送一个明确的 done 事件，再 complete 流；前端收到 done 后主动关闭 EventSource，避免自动重连。
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
